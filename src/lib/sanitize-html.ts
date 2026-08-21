import sanitizeHtml from "sanitize-html";

export function sanitizeHtmlContent(html: string): string {
  if (!html) {
    return "";
  }

  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "strike",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "data-public-id"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
      },
    },
    allowedSchemes: ["https"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
      img: (tagName, attribs) => {
        if (attribs.src && !attribs.src.startsWith("https://")) {
          delete attribs.src;
        }
        return { tagName, attribs };
      },
    },
  });
}
