/**
 * NÅD LANDNINGSSIDA & BYRÅSTRATEGI
 * Interaktiv logik, kalkylator, checkout-konfigurator och byråläge
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. MILJÖ- OCH BESPARINGSKALKYLATOR
     ============================================================ */
  const familySlider = document.getElementById('familySlider');
  const sliderValueDisplay = document.getElementById('sliderValueDisplay');
  const calcPlastics = document.getElementById('calcPlastics');
  const calcCo2 = document.getElementById('calcCo2');
  const calcWater = document.getElementById('calcWater');

  const personLabels = {
    1: '1 person (Singel)',
    2: '2 personer (Par)',
    3: '3 personer',
    4: '4 personer (Familj)',
    5: '5+ personer'
  };

  function updateCalculator(persons) {
    // 1 person förbrukar i snitt ca 12 flaskor flytande tvål (250ml) per år
    const bottlesPerPerson = 12;
    const totalBottles = persons * bottlesPerPerson;
    
    // Varje konventionell flaska väger ca 285g med vatten och emballage.
    // NÅD tablett väger ~10g.
    const weightSavedKg = ((totalBottles * 0.275)).toFixed(1).replace('.', ',');

    if (sliderValueDisplay) sliderValueDisplay.textContent = personLabels[persons] || `${persons} personer`;
    if (calcPlastics) calcPlastics.textContent = totalBottles;
    if (calcWater) calcWater.textContent = `${weightSavedKg} kg`;
    if (calcCo2) calcCo2.textContent = '94%';
  }

  if (familySlider) {
    familySlider.addEventListener('input', (e) => {
      updateCalculator(parseInt(e.target.value, 10));
    });
    // Initiera vid start
    updateCalculator(parseInt(familySlider.value, 10));
  }


  /* ============================================================
     2. ERBJUDANDE & KÖPKONFIGURATOR (PRENUMERATION VS ENGÅNGSKÖP)
     ============================================================ */
  const modeSubscription = document.getElementById('modeSubscription');
  const modeOneTime = document.getElementById('modeOneTime');
  const priceDisplay = document.getElementById('priceDisplay');
  const originalPriceDisplay = document.getElementById('originalPriceDisplay');
  const saveTagDisplay = document.getElementById('saveTagDisplay');
  const subFreqBox = document.getElementById('subFreqBox');
  const btnActionText = document.getElementById('btnActionText');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const cartToast = document.getElementById('cartToast');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const stickyPrice = document.querySelector('.sticky-price');

  let currentMode = 'subscription'; // 'subscription' | 'onetime'

  function setPurchaseMode(mode) {
    currentMode = mode;

    if (mode === 'subscription') {
      modeSubscription.classList.add('active');
      modeSubscription.setAttribute('aria-checked', 'true');
      modeOneTime.classList.remove('active');
      modeOneTime.setAttribute('aria-checked', 'false');

      priceDisplay.textContent = '249';
      originalPriceDisplay.textContent = '349 kr';
      saveTagDisplay.textContent = 'Du sparar 100 kr (15% prenumerationsrabatt)';
      if (subFreqBox) subFreqBox.style.display = 'block';
      if (btnActionText) btnActionText.textContent = 'Beställ Startkit med prenumeration • 249 kr';
      if (stickyPrice) stickyPrice.innerHTML = '249 kr <del>349 kr</del>';
    } else {
      modeOneTime.classList.add('active');
      modeOneTime.setAttribute('aria-checked', 'true');
      modeSubscription.classList.remove('active');
      modeSubscription.setAttribute('aria-checked', 'false');

      priceDisplay.textContent = '299';
      originalPriceDisplay.textContent = '349 kr';
      saveTagDisplay.textContent = 'Du sparar 50 kr';
      if (subFreqBox) subFreqBox.style.display = 'none';
      if (btnActionText) btnActionText.textContent = 'Beställ Startkit som engångsköp • 299 kr';
      if (stickyPrice) stickyPrice.innerHTML = '299 kr <del>349 kr</del>';
    }
  }

  if (modeSubscription && modeOneTime) {
    modeSubscription.addEventListener('click', () => setPurchaseMode('subscription'));
    modeOneTime.addEventListener('click', () => setPurchaseMode('onetime'));

    // Keyboard accessibility för tabs
    modeSubscription.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setPurchaseMode('subscription'); }
    });
    modeOneTime.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setPurchaseMode('onetime'); }
    });
  }

  // Beställningsklick & Toast
  let cartCount = 0;
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      cartCount++;
      if (cartCountBadge) cartCountBadge.textContent = cartCount;

      if (cartToast) {
        cartToast.classList.add('show');
        setTimeout(() => {
          cartToast.classList.remove('show');
        }, 4500);
      }
    });
  }


  /* ============================================================
     3. FAQ ACCORDION
     ============================================================ */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const answer = parentItem.querySelector('.faq-answer');
      const isOpen = parentItem.classList.contains('open');

      // Stäng alla andra för ren upplevelse
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        parentItem.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ============================================================
     4. AGENCY STRATEGY & PITCH DRAWER
     ============================================================ */
  const agencyDrawer = document.getElementById('agencyDrawer');
  const agencyDrawerBackdrop = document.getElementById('agencyDrawerBackdrop');
  const openAgencyDrawerBtn = document.getElementById('openAgencyDrawerBtn');
  const footerAgencyBtn = document.getElementById('footerAgencyBtn');
  const footerAgencyTrigger = document.getElementById('footerAgencyTrigger');
  const closeAgencyDrawerBtn = document.getElementById('closeAgencyDrawerBtn');

  function openAgencyDrawer() {
    if (agencyDrawer && agencyDrawerBackdrop) {
      agencyDrawer.classList.add('open');
      agencyDrawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (openAgencyDrawerBtn) openAgencyDrawerBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeAgencyDrawer() {
    if (agencyDrawer && agencyDrawerBackdrop) {
      agencyDrawer.classList.remove('open');
      agencyDrawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (openAgencyDrawerBtn) openAgencyDrawerBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (openAgencyDrawerBtn) openAgencyDrawerBtn.addEventListener('click', openAgencyDrawer);
  if (footerAgencyBtn) footerAgencyBtn.addEventListener('click', openAgencyDrawer);
  if (footerAgencyTrigger) footerAgencyTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openAgencyDrawer();
  });
  if (closeAgencyDrawerBtn) closeAgencyDrawerBtn.addEventListener('click', closeAgencyDrawer);
  if (agencyDrawerBackdrop) agencyDrawerBackdrop.addEventListener('click', closeAgencyDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && agencyDrawer && agencyDrawer.classList.contains('open')) {
      closeAgencyDrawer();
    }
  });

  // Flikar i byråpanelen
  const agencyTabBtns = document.querySelectorAll('.agency-tab-btn');
  const agencyTabPanes = document.querySelectorAll('.agency-tab-pane');

  agencyTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      agencyTabBtns.forEach(b => b.classList.remove('active'));
      agencyTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });


  /* ============================================================
     5. STICKY MOBILE BAR SCROLL DETECTION
     ============================================================ */
  const stickyMobileBar = document.getElementById('stickyMobileBar');
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768 && stickyMobileBar && heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom - 100) {
        stickyMobileBar.style.display = 'flex';
      } else {
        stickyMobileBar.style.display = 'none';
      }
    }
  }, { passive: true });

});
