import Image from '@tiptap/extension-image';

// text-align doesn't work on <img> elements, so we use margin-based centering
export const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('data-alignment') || null;
        },
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.alignment) return {};

          const styleMap: Record<string, string> = {
            center: 'display: block; margin-left: auto; margin-right: auto;',
            right: 'display: block; margin-left: auto; margin-right: 0;',
            left: 'display: block; margin-left: 0; margin-right: auto;',
          };

          return {
            style: styleMap[attributes.alignment] || '',
            'data-alignment': attributes.alignment,
          };
        },
      },
    };
  },
});
