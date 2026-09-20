import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { generatePageMetadata, getOrganizationSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Elysium | Artisan Minimalist Home Decor, Handcrafted in India',
  'Discover Elysium’s artisan-made home decor — handcrafted in India, curated for luxury homes worldwide. Explore our digital showroom and enquire today.',
  '/'
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-black text-white selection:bg-white selection:text-black font-sans min-h-screen flex flex-col justify-between antialiased">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
