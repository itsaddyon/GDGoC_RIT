import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gdgrit.vercel.app";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/core/', '/profile/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
