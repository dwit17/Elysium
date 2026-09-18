import { BRAND_INFO } from './constants';

export function createWhatsAppLink(productName?: string): string {
  const number = BRAND_INFO.whatsappNumber;
  let text = `Hello Elysium, I would like to enquire about your artisan home decor collection.`;

  if (productName) {
    text = `Hello Elysium, I am interested in inquiring about the "${productName}" piece from your collection. Could you please share more details and availability?`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
