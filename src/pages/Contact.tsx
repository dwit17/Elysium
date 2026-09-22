import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BRAND, createWhatsAppLink } from '../data/brand';

interface ContactProps {
  initialPieceName?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialPieceName = '' }) => {
  const initialMessage = initialPieceName
    ? `Hello Elysium, I am interested in inquiring about the "${initialPieceName}" piece from your artisan collection. Could you please share more details and availability?`
    : '';

  return (
    <Layout currentPath="/contact">
      <div className="pt-28 pb-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">ENQUIRIES &amp; CONSULTATIONS</span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Contact Elysium</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div className="baroque-box-frame p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 block mb-2">Instant Communication</span>
                <h3 className="text-xl font-light text-white uppercase mb-4">WhatsApp Direct Line</h3>
                <a href={createWhatsAppLink(initialPieceName)} target="_blank" rel="noopener noreferrer" className="btn-slide-white w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md block">
                  <span>OPEN WHATSAPP CHAT</span>
                  <span className="btn-arrow ml-2">&rarr;</span>
                </a>
              </div>

              <div className="baroque-box-frame p-8">
                <div className="space-y-4 text-xs font-mono text-stone-300">
                  <p><span className="text-stone-500 block">ADDRESS</span>{BRAND.address}</p>
                  <p><span className="text-stone-500 block">PHONE</span>+91 {BRAND.phoneDisplay}</p>
                  <p><span className="text-stone-500 block">HOURS</span>{BRAND.timing}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="baroque-box-frame p-8">
                <h2 className="text-2xl font-light tracking-wide text-white uppercase mb-6">Send an Enquiry</h2>
                <div id="form-success-alert" className="hidden p-6 bg-stone-900 border border-stone-800 text-center mb-6">
                  <h3 className="text-lg font-light text-white uppercase">Enquiry Received</h3>
                  <p className="text-xs text-stone-400 mt-2">Thank you. An atelier curator will respond within 24 hours.</p>
                </div>
                <form id="contact-form" className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input type="text" name="fullName" required placeholder="Full Name *" className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors" />
                    <input type="email" name="email" required placeholder="Email Address *" className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors" />
                  </div>
                  <textarea id="contact-message" name="message" required rows={5} placeholder="Your Message..." defaultValue={initialMessage} className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors"></textarea>
                  <button type="submit" className="btn-slide-white w-full py-4 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md">
                    <span>SUBMIT FORM ENQUIRY</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
