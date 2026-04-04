import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {

      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        originalWidth?: number | null;
        alignment?: string | null;
        width?: string | null;
      }) => ReturnType;
    };
  }
}
