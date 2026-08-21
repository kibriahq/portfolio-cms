import Image from "@tiptap/extension-image";

export interface ImageWithPublicIdOptions {
  inline: boolean;
  allowBase64: boolean;
}

const ImageWithPublicId = Image.extend({
  name: "image",
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-public-id"),
        renderHTML: (attributes) => {
          if (!attributes.publicId) {
            return {};
          }
          return { "data-public-id": attributes.publicId };
        },
      },
    };
  },
});

export default ImageWithPublicId;
