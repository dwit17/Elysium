import { MetadataRoute } from 'next';
import { BRAND_INFO } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BRAND_INFO.domain}/sitemap.xml`,
  };
}
