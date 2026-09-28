import Image from "next/image";
import clsx from "clsx";
import type { Pic } from "@/lib/images";

type Props = {
  pic: Pic;
  sizes: string;
  className?: string;
  /** Fill the parent (parent must be positioned); otherwise intrinsic size. */
  fill?: boolean;
  preload?: boolean;
  quality?: 60 | 75 | 85;
  style?: React.CSSProperties;
};

/** next/image with the correct intrinsic size baked in. Frames supply a paper-colour background while loading. */
export function Img({ pic, sizes, className, fill = true, preload, quality = 75, style }: Props) {
  return (
    <Image
      src={pic.src}
      alt={pic.alt}
      sizes={sizes}
      quality={quality}
      preload={preload}
      {...(fill ? { fill: true } : { width: pic.width, height: pic.height })}
      className={clsx(fill && "object-cover", className)}
      style={style}
    />
  );
}
