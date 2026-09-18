import { Metadata } from 'next';
import { BRAND_INFO, Product } from './constants';

export function canonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BRAND_INFO.domain}${cleanPath === '/' ? '' : cleanPath}`;
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  ogImage: string = '/images/photo-1600121848594-d8644e57abab'
): Metadata {
  const fullTitle = title.includes(BRAND_INFO.name)
    ? title
    : `${title} | ${BRAND_INFO.name}`;
  const url = canonicalUrl(path);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BRAND_INFO.domain),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND_INFO.fullName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_INFO.fullName,
    alternateName: BRAND_INFO.name,
    url: BRAND_INFO.domain,
    logo: `${BRAND_INFO.domain}/images/logo.png`,
    description: BRAND_INFO.heroStatement,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shree Bhaichand Mehta Ind. Area, Plot no. 29, Behind Hotel Krishna Park, Opposite KICH INDUSTRIES, Vavdi',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360004',
      addressCountry: 'IN',
    },
    telephone: BRAND_INFO.phoneTel,
    email: BRAND_INFO.email,
  };
}

export function getProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [`${BRAND_INFO.domain}${product.image}`],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: BRAND_INFO.name,
    },
    material: product.material,
    category: product.category,
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
