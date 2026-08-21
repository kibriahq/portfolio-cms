"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Table as TableIcon,
  Minus,
  CodeXml,
  ChevronDown,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        "disabled:pointer-events-none disabled:opacity-40",
        active &&
          "bg-accent-600 text-white hover:bg-accent-600 hover:text-white dark:hover:bg-accent-600",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden />
  );
}

const editorClass =
  "tiptap-content min-h-[20rem] px-3 py-3 text-sm leading-relaxed focus:outline-none";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your post content here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      HorizontalRule,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: editorClass,
        "aria-label": "Post content editor",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white transition-colors focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/30 dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <Toolbar editor={editor} placeholder={placeholder} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .tiptap-content table {
              border-collapse: collapse;
              table-layout: fixed;
              width: 100%;
              margin: 1rem 0;
              overflow: hidden;
            }
            .tiptap-content table td,
            .tiptap-content table th {
              border: 1px solid rgb(228 228 231);
              padding: 0.5rem 0.75rem;
              vertical-align: top;
              position: relative;
              min-width: 1em;
            }
            .dark .tiptap-content table td,
            .dark .tiptap-content table th {
              border-color: rgb(39 39 42);
            }
            .tiptap-content table th {
              background-color: rgb(244 244 245);
              font-weight: 600;
              text-align: left;
            }
            .dark .tiptap-content table th {
              background-color: rgb(24 24 27);
            }
            .tiptap-content table .selectedCell::after {
              background: rgba(99, 102, 241, 0.2);
              content: "";
              left: 0; right: 0; top: 0; bottom: 0;
              position: absolute;
              pointer-events: none;
              z-index: 2;
            }
            .tiptap-content table .column-resize-handle {
              background-color: rgb(99 102 241);
              bottom: -2px;
              position: absolute;
              right: -2px;
              top: 0;
              width: 4px;
              pointer-events: none;
            }
            .tiptap-content table p { margin: 0; }
          `,
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}

interface TableMenuAction {
  label: string;
  run: () => void;
}

function TableControls({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  const actions: TableMenuAction[] = [
    {
      label: "Add row before",
      run: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: "Add row after",
      run: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Delete row",
      run: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: "Add column before",
      run: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: "Add column after",
      run: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Delete column",
      run: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      label: "Toggle header row",
      run: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: "Toggle header column",
      run: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
    {
      label: "Delete table",
      run: () => editor.chain().focus().deleteTable().run(),
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        title="Table options"
        aria-label="Table options"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors",
          "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
          "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
          open && "bg-accent-600 text-white hover:bg-accent-600 hover:text-white",
        )}
      >
        Table
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open ? (
        <div
          className="absolute z-20 mt-1 w-44 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          onMouseDown={(event) => event.preventDefault()}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.run();
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Toolbar({
  editor,
  placeholder,
}: {
  editor: Editor;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeXml className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Justify"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Insert link"
        active={editor.isActive("link")}
        onClick={() => {
          const previous = editor.getAttributes("link").href as
            | string
            | undefined;
          const url = window.prompt("Enter URL", previous ?? "https://");
          if (url === null) {
            return;
          }
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Insert table"
        active={editor.isActive("table")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="h-4 w-4" />
      </ToolbarButton>

      {editor.isActive("table") ? (
        <TableControls editor={editor} />
      ) : null}

      <Divider />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      {placeholder ? (
        <span className="ml-auto hidden text-xs text-zinc-400 dark:text-zinc-600 sm:block">
          {placeholder}
        </span>
      ) : null}
    </div>
  );
}
