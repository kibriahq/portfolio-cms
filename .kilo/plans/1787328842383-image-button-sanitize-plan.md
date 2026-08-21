# Rich-Text Image Support + Cloudinary Lifecycle + Sanitization

## Context

`RichTextEditor` (`src/components/forms/RichTextEditor.tsx`, `"use client"`) is a TipTap editor used by
`PostForm`, `ProjectForm`, `CaseStudyForm`. Output HTML is stored **verbatim** in the DB
(`Blog.content`, `CaseStudy.content` `@db.Text`; `Project.description`) — **no sanitization** today (XSS gap).

There is **no in-editor image support**. The only image flow is `coverImage`, uploaded via
`uploadImage(file, folder)` (`src/actions/upload.ts`) → **Cloudinary** (repo's sole storage). Deletion of cover
images already works via `deleteImage(publicId)` in `updatePost/deletePost` (and projects/caseStudies).

## New requirements (user-confirmed)
1. **Image button** in editor: insert a **block `<img>`** via upload (→ Cloudinary) **or** external URL.
2. **Delete from Cloudinary when an image is removed from the editor** (live, even before save).
3. **Delete all in-content images from Cloudinary when the blog/project/case-study is deleted.**
4. **Sanitize** stored HTML at save time (closes XSS gap).

## Core design problem & decision
`deleteImage` needs the Cloudinary **`public_id`**. TipTap's stock `Image` node only stores `src`.
**Decision: extend the Image extension to carry a `publicId` attribute, rendered as `data-public-id` in HTML.**
- Upload path: `setImage({ src: secure_url, publicId })` → HTML stores `data-public-id`.
- External-URL path: no `publicId` → never deleted from Cloudinary (we don't own it).
- Deriving `public_id` from a Cloudinary `secure_url` is fragile; storing it explicitly is reliable.

## Architecture / data flow
```
Image button
 ├─ Upload : <input type=file> → uploadImage(file,"content") → { secure_url, public_id }
 │            → editor.setImage({ src: secure_url, publicId: public_id })
 └─ URL     : https URL → editor.setImage({ src: url })        // no publicId

editor HTML embeds: <img src="..." data-public-id="portfolio/content/abc">

onUpdate (diff): previous publicIds − current publicIds → deleteImage(each)   // live removal
save (server action): sanitizeHtml(content) → prisma.create/update
record delete: extract data-public-id from content/description → deleteImage(each) → prisma.delete
```

## Implementation

### 1. Dependencies (pnpm)
- `@tiptap/extension-image` (match installed TipTap `^3.x`).
- `sanitize-html` (Node; runs in server actions). Add to `dependencies`.

### 2. Custom Image extension — `src/components/forms/extensions/image-with-public-id.ts` (NEW)
- Wrap `Image` from `@tiptap/extension-image`.
- Add attribute `publicId`:
  - `parseHTML`: read `data-public-id`.
  - `renderHTML`: emit `data-public-id` (and keep `src`, `alt`, `title`).
  - `addCommands`: `setImage` already accepts extra attrs, so callers pass `publicId`.
- Register in `RichTextEditor` `useEditor` extensions instead of stock `Image`.

### 3. `RichTextEditor.tsx`
- Import `uploadImage`, `deleteImage` from `@/actions/upload`; import custom Image; import `useState/useRef` (already has `useEffect`).
- Register extension: `ImageWithPublicId.configure({ inline: false, allowBase64: false })`.
- **Image toolbar button** (lucide `Image`, `active={editor.isActive("image")}`) opening a popover (mirror
  `TableControls` pattern: `useState`, `onMouseDown` `preventDefault`):
  - **Upload tab**: hidden `<input type="file" accept="image/*">`; on change → `uploadImage(file, "content")`;
    on success `editor.chain().focus().setImage({ src: secure_url, publicId: public_id }).run()`; show errors.
  - **URL tab**: text + Insert; validate `^https://`; `setImage({ src: url })` (no publicId).
- **Live deletion**: add a `useRef<string[]>` holding current `publicId`s. In `onUpdate` (and after `setContent`
  in the `useEffect` sync), compute current `publicId`s from `editor.getJSON()`/`getHTML`; for any id in
  `prevRef` but not current → `await deleteImage(id)`. Update `prevRef`. Guard so this only runs client-side
  and is a no-op when the set is unchanged.

### 4. Sanitizer — `src/lib/sanitize-html.ts` (NEW)
- Allowlist tags matching TipTap output: `p, br, strong, b, em, i, s, strike, code, pre, h1, h2, h3, ul, ol,
  li, blockquote, a, img, hr, table, thead, tbody, tr, th, td`.
- Allowed attrs: `a[href,target,rel]`, `img[src,alt,title,width,height,data-public-id]`, `th/td[colspan,rowspan]`,
  minimal `style` (allow `text-align` only).
- `img[src]` restricted to `https:` (no `data:`; `allowBase64:false`).
- `a`: `transformTags` forces `rel="noopener noreferrer nofollow"`, `target="_blank"`.
- Export `sanitizeHtml(html: string): string`.

### 5. Image extraction helper — `src/lib/image-utils.ts` (NEW)
- `extractPublicIds(html: string): string[]` — parse HTML (e.g. via `sanitize-html`'s parser or a simple regex
  on `<img data-public-id="...">`), return the `data-public-id` values.
- Used by record-delete actions.

### 6. Save-time sanitize — `src/actions/{posts,projects,caseStudies}.ts`
- At top of each `create*`/`update*` (before `prisma...create/update`):
  `data.content = sanitizeHtml(data.content ?? "")` (and `data.description` for projects).
- Import `sanitizeHtml`.

### 7. Delete-time cleanup — `src/actions/{posts,projects,caseStudies}.ts`
- In `deletePost`/`deleteProject`/`deleteCaseStudy`, **before** `prisma...delete`, extract publicIds from the
  record's `content` (and `description` for projects) via `extractPublicIds(...)` and `await deleteImage(id)`
  for each (wrap in try/catch so a Cloudinary failure doesn't block the DB delete — log and continue).
- Keep existing `coverImagePublicId` deletion as-is.

## Files
- `src/components/forms/extensions/image-with-public-id.ts` — NEW custom Image (publicId).
- `src/components/forms/RichTextEditor.tsx` — Image button/popover + live-delete diff; import `uploadImage`/`deleteImage`.
- `package.json` — add `@tiptap/extension-image`, `sanitize-html`.
- `src/lib/sanitize-html.ts` — NEW.
- `src/lib/image-utils.ts` — NEW (`extractPublicIds`).
- `src/actions/posts.ts`, `src/actions/projects.ts`, `src/actions/caseStudies.ts` — sanitize on save; delete in-content images on record delete.

## Risks / edge cases
- **Orphaned uploads**: if a user uploads then removes an image before saving, the live diff deletes it from
  Cloudinary immediately — DB never had it, so no inconsistency. Acceptable.
- **External URLs**: no `publicId` → never deleted from Cloudinary (correct; not our asset). Sanitizer still
  permits `https` img src.
- **Move/reorder**: same `publicId` stays in set → not deleted. Diff on `publicId` sets handles this.
- **Server-action file passing**: calling `uploadImage(file)` from the client passes a `File` via React
  serialization (the existing cover-image flow does exactly this) — acceptable.
- **Sanitizer allowlist** must include tables + `data-public-id` or valid content/ids get stripped — keep in sync.
- **Cloudinary delete failure** on record delete must not abort the DB delete (try/catch + log).

## Validation
- `pnpm run lint` → 0 errors; `pnpm run build` succeeds.
- Manual: Post form → Image → upload file (renders; persists). Remove it in editor → confirm it's gone from
  Cloudinary (Media Library) and from saved `content`. Insert by URL → not deleted on removal (external).
  Delete the whole Post → all in-content Cloudinary images removed.
  Save HTML containing `<script>`/`onerror` → confirm stripped in stored `content`.
