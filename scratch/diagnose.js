const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log('--- 1. HTML PAYLOAD CHECK ---');
    console.log('Status:', res.statusCode);
    console.log('HTML Byte Length:', html.length);

    console.log('\n--- 2. SCRIPT TAGS IN HTML ---');
    const scripts = html.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/gi) || [];
    scripts.forEach(s => console.log(s));

    console.log('\n--- 3. SECTION SELECTORS COUNT ---');
    const selectors = [
      '.section-brand-story',
      '.eyebrow-word',
      '.story-copy-block',
      '.story-images-wrap',
      '.story-bg-img',
      '.story-fg-img',
      '.section-collections-showcase',
      '.collection-chapter',
      '.ambient-thumb',
      '.chapter-title-mask',
      '.chapter-title-inner',
      '.chapter-detail-elem',
      '.chapter-pinned-col',
      '.section-craftsmanship',
      '.craft-trust-col',
      '.stat-number-counter',
      '.section-featured-products',
      '.product-grid-card',
      '.product-card-hover',
      '.product-card-img',
      '.product-card-overlay',
      '.section-cta-strip',
      '.cta-bg-parallax',
      '.cta-fade-elem',
      '.btn-wipe-primary',
      '.btn-wipe-secondary'
    ];

    selectors.forEach(sel => {
      const cls = sel.replace('.', '');
      // Count occurrences of class name
      const count = (html.match(new RegExp('\\b' + cls + '\\b', 'g')) || []).length;
      console.log(sel.padEnd(35), '->', count, 'elements');
    });
  });
}).on('error', err => console.error('Connection error:', err.message));
