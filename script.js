const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mobileNav');

toggle?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('.back-link').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector('#categorias');
    if (target) target.scrollIntoView({behavior:'smooth'});
  });
});

// Animación de entrada
const cards = document.querySelectorAll('.menu-card, .category-card');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08});
  cards.forEach(card => { card.classList.add('reveal'); observer.observe(card); });
} else {
  cards.forEach(card => card.classList.add('visible'));
}

/*
 * Precios editables desde admin.html.
 * IMPORTANTE: localStorage funciona en el mismo navegador/dispositivo.
 * Para que los cambios sean visibles para TODOS los clientes en internet,
 * esta versión debe conectarse posteriormente a una base de datos/backend.
 */
const PRICE_STORAGE_KEY = 'cafeLlibelulaPriceOverridesV1';

function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function priceKey(section, name) {
  return `${section}::${normalizeText(name)}`;
}

function getOverrides() {
  try { return JSON.parse(localStorage.getItem(PRICE_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function applySavedPrices() {
  const overrides = getOverrides();

  document.querySelectorAll('.menu-section').forEach(section => {
    const sectionId = section.id || 'menu';

    section.querySelectorAll('.item').forEach(item => {
      const nameEl = item.querySelector('b');
      const priceEl = item.querySelector('strong');
      if (!nameEl || !priceEl) return;
      const key = priceKey(sectionId, nameEl.textContent);
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        priceEl.textContent = overrides[key];
      }
    });

    section.querySelectorAll('.menu-card h3').forEach(h3 => {
      const priceEl = h3.querySelector('.section-price');
      if (!priceEl) return;
      const name = normalizeText(h3.textContent).replace(/C\$[\d.,]+/g, '').trim();
      const key = priceKey(sectionId, `__section__${name}`);
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        priceEl.textContent = overrides[key];
      }
    });
  });
}

applySavedPrices();
