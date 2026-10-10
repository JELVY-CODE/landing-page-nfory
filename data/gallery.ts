import type { GalleryItem } from "@/lib/gallery";

// Los campos vacíos se muestran como marcadores. Las imágenes van en /public/images/.
const emptyItem = (id: string): GalleryItem => ({
  id,
  category: {},
  title: {},
  description: {},
  image: "",
  imageAlt: {},
});

export const galleryRows: GalleryItem[][] = [
  ["p1", "p2", "p3", "p4", "p5"].map(emptyItem),
  ["p6", "p7", "p8", "p9", "p10"].map(emptyItem),
];
