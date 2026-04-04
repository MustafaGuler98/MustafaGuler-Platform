import Image from '@tiptap/extension-image';

export const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-alignment') || null,
        renderHTML: () => ({}),
      },
      width: {
        default: null, // null = natural image size
        parseHTML: (element: HTMLElement) => element.getAttribute('data-width') || null,
        renderHTML: () => ({}),
      },
      originalWidth: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute('data-original-width');
          return value ? Number.parseInt(value, 10) || null : null;
        },
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const alignment = node.attrs.alignment || null;
    const width = node.attrs.width || null;
    const originalWidth = typeof node.attrs.originalWidth === 'number' ? node.attrs.originalWidth : null;

    const alignmentStyles: Record<string, string[]> = {
      center: ['margin-left: auto', 'margin-right: auto'],
      right: ['margin-left: auto', 'margin-right: 0'],
      left: ['margin-left: 0', 'margin-right: auto'],
    };

    const styleParts: string[] = ['display: block', 'height: auto', 'max-width: 100%'];
    if (width) {
      const pct = parseInt(width);
      if (!Number.isNaN(pct) && pct > 0 && originalWidth) {
        styleParts.push(`width: ${Math.round((originalWidth * pct) / 100)}px`);
      } else {
        styleParts.push(`width: ${width}`);
      }
    } else {
      styleParts.push('width: auto');
    }

    styleParts.push(...(alignmentStyles[alignment] || ['margin-left: 0', 'margin-right: 0']));

    return ['img', {
      ...HTMLAttributes,
      style: styleParts.join('; '),
      ...(alignment ? { 'data-alignment': alignment } : {}),
      ...(width ? { 'data-width': width } : {}),
      ...(originalWidth ? { 'data-original-width': String(originalWidth) } : {}),
    }];
  },
});
