import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://fil-frame.com',
      lastModified: new Date(),
    },
  ];
}
