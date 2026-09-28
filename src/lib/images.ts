import { IMAGE_META } from "@/data/images.gen";

export type ImageKey = keyof typeof IMAGE_META;

/** Everything next/image needs, resolved on the server so client bundles never ship the manifest. */
export type Pic = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export function pic(key: ImageKey, alt: string): Pic {
  const [width, height] = IMAGE_META[key];
  return { src: `/images/${key}.jpg`, width, height, alt };
}
