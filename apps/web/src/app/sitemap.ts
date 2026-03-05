import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ingoma-web.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://ingoma-web.vercel.app/about',
      lastModified: new Date(),
    },
    {
      url: 'https://ingoma-web.vercel.app/portfolio',
      lastModified: new Date(),
    },
    {
      url: 'https://ingoma-web.vercel.app/services',
      lastModified: new Date(),
    },
  ];
}
