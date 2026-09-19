const fs = require('fs');
const path = require('path');

console.log('=== GSAP & SCROLL ANIMATION DIAGNOSTIC ===');

// 1. Check vendor bundle files
const gsapPath = path.join(__dirname, '../public/js/vendor/gsap.min.js');
const stPath = path.join(__dirname, '../public/js/vendor/ScrollTrigger.min.js');
const lenisPath = path.join(__dirname, '../public/js/vendor/lenis.min.js');
const homeAnimPath = path.join(__dirname, '../public/js/homeAnimations.js');

console.log('1. Vendor bundles:');
console.log('  gsap.min.js size:', fs.statSync(gsapPath).size, 'bytes');
console.log('  ScrollTrigger.min.js size:', fs.statSync(stPath).size, 'bytes');
console.log('  lenis.min.js size:', fs.statSync(lenisPath).size, 'bytes');
console.log('  homeAnimations.js size:', fs.statSync(homeAnimPath).size, 'bytes');

// 2. Inspect homeAnimations.js contents
const homeAnimCode = fs.readFileSync(homeAnimPath, 'utf8');
console.log('\n2. Code inspection:');
console.log('  Has gsap.registerPlugin(ScrollTrigger):', homeAnimCode.includes('gsap.registerPlugin(ScrollTrigger)'));
console.log('  Has lenis.on("scroll", ...):', homeAnimCode.includes('lenisInstance.on(\'scroll\''));
console.log('  Has ScrollTrigger.update():', homeAnimCode.includes('ScrollTrigger.update()'));
console.log('  Has gsap.ticker.add for Lenis:', homeAnimCode.includes('gsap.ticker.add'));
console.log('  Has DOMContentLoaded / ready check:', homeAnimCode.includes('DOMContentLoaded'));
console.log('  Has ScrollTrigger.refresh():', homeAnimCode.includes('ScrollTrigger.refresh()'));
