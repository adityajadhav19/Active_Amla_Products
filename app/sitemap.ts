import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://activeproducts.in",
      lastModified: new Date(),
    },
    {
      url: "https://activeproducts.in/products",
      lastModified: new Date(),
    },
    {
      url: "https://activeproducts.in/about",
      lastModified: new Date(),
    },
    {
      url: "https://activeproducts.in/contact",
      lastModified: new Date(),
    },
  ];
}
