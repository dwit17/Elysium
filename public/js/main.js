document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle & Keyboard Accessibility
  const menuToggleBtn = document.getElementById('mobile-menu-btn');
  const menuCloseBtn = document.getElementById('mobile-menu-close-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');

  function openDrawer() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', openDrawer);
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeDrawer);
  }

  if (mobileMenuDrawer) {
    // Close drawer when clicking any link inside
    const drawerLinks = mobileMenuDrawer.querySelectorAll('a');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenuDrawer.classList.contains('hidden')) {
        closeDrawer();
      }
    });
  }

  // 2. Materiality Interactive Medium Switcher & Light Angle Simulation
  const lightSlider = document.getElementById('light-angle-slider');
  const lightAngleDisplay = document.getElementById('light-angle-display');
  const materialLightOverlay = document.getElementById('material-light-overlay');
  const macroZoomBtn = document.getElementById('macro-zoom-btn');
  const materialPreviewImg = document.getElementById('material-preview-img');
  const materialTitleDisplay = document.getElementById('material-title-display');
  const materialCards = document.querySelectorAll('.material-card');

  function updateLightAngle(angle) {
    if (lightAngleDisplay) lightAngleDisplay.innerText = `Incident Angle: ${angle}°`;
    if (lightSlider) lightSlider.value = angle;
    if (materialLightOverlay) {
      materialLightOverlay.style.background = `linear-gradient(${angle}deg, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.75) 100%)`;
    }
  }

  if (lightSlider) {
    lightSlider.addEventListener('input', (e) => {
      updateLightAngle(e.target.value);
    });
  }

  if (materialCards.length > 0) {
    materialCards.forEach((card) => {
      card.addEventListener('click', () => {
        materialCards.forEach((c) => {
          c.classList.remove('active-material', 'border-stone-400', 'bg-opacity-80');
          c.classList.add('border-stone-800', 'bg-opacity-40');
        });
        card.classList.add('active-material', 'border-stone-400', 'bg-opacity-80');
        card.classList.remove('border-stone-800', 'bg-opacity-40');

        const macroImg = card.getAttribute('data-macro-img');
        const defaultAngle = card.getAttribute('data-default-angle') || 135;
        const name = card.getAttribute('data-name');

        if (materialPreviewImg && macroImg) {
          materialPreviewImg.style.opacity = '0';
          setTimeout(() => {
            materialPreviewImg.src = macroImg;
            materialPreviewImg.style.opacity = '1';
          }, 200);
        }

        if (materialTitleDisplay && name) {
          materialTitleDisplay.innerText = name;
        }

        updateLightAngle(defaultAngle);
      });
    });
  }

  if (macroZoomBtn && materialPreviewImg) {
    let isZoomed = false;
    macroZoomBtn.addEventListener('click', () => {
      isZoomed = !isZoomed;
      if (isZoomed) {
        materialPreviewImg.style.transform = 'scale(1.35)';
        macroZoomBtn.innerText = 'Reset View';
      } else {
        materialPreviewImg.style.transform = 'scale(1)';
        macroZoomBtn.innerText = 'Macro Zoom';
      }
    });
  }

  // 3. Category Filtering on /artisan-pieces
  const categoryButtons = document.querySelectorAll('.category-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (categoryButtons.length > 0 && productCards.length > 0) {
    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        categoryButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        productCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'All' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Contact Form Submission & Client-Side Param Prefill Fallback
  const contactForm = document.getElementById('contact-form');
  const formSuccessAlert = document.getElementById('form-success-alert');
  const contactMessage = document.getElementById('contact-message');

  if (contactMessage && !contactMessage.value.trim()) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const piece = urlParams.get('piece');
      if (piece) {
        contactMessage.value = `Hello Elysium, I am interested in inquiring about the "${piece}" piece from your artisan collection. Could you please share more details and availability?`;
      }
    } catch (e) {}
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      if (formSuccessAlert) {
        formSuccessAlert.classList.remove('hidden');
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});
