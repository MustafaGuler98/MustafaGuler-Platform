"use client";

import Image, { ImageProps } from "next/image";
import { backendImageLoader, shouldUseBackendImageOptimization } from "@/lib/utils";

// This component decides whether to use Next.js's built-in image optimization or backend.
export function OptimizedImage(props: ImageProps) {
  const { src, ...rest } = props;

  if (typeof src !== "string" || !shouldUseBackendImageOptimization(src)) {
    return <Image src={src} {...rest} />;
  }

  return (
    <Image
      src={src}
      {...rest}
      loader={backendImageLoader}
    />
  );
}
