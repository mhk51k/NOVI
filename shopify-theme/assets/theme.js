// Thème NOVI — interactions vanilla JS (pas de framework : cf. convention du projet
// d'origine, "Svelte seulement si interactivité réelle nécessaire" ; ici l'API Cart AJAX
// native de Shopify suffit).

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCartCount();
  initAddToCartForms();
  initVariantPickers();
  initQuantityPickers();
  initCartLineActions();
  initBundleSelectors();
});

function initMobileNav() {
  const toggle = document.querySelector('[data-mobile-nav-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function updateCartCountBubble(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.setAttribute('data-cart-count', String(count));
    el.setAttribute('aria-label', `Panier, ${count} article(s)`);
  });
}

function initCartCount() {
  fetch('/cart.js')
    .then((r) => r.json())
    .then((cart) => updateCartCountBubble(cart.item_count))
    .catch(() => {});
}

// Formulaires "Ajouter au panier" (produit + quick-buy) : ajout AJAX, avec option de
// redirection directe vers le checkout (achat en un clic) via data-checkout-redirect.
function initAddToCartForms() {
  document.querySelectorAll('[data-add-to-cart-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const note = form.querySelector('[data-form-note]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = form.dataset.loadingLabel || 'Ajout…';
      }
      if (note) note.textContent = '';

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          if (note) note.textContent = data?.description || "Impossible d'ajouter ce produit au panier.";
          return;
        }

        if (form.dataset.checkoutRedirect === 'true') {
          window.location.href = '/checkout';
          return;
        }

        await initCartCount();
        if (note) note.textContent = 'Ajouté au panier ✓';
        window.dispatchEvent(new CustomEvent('novi:cart-updated'));
      } catch (error) {
        if (note) note.textContent = 'Une erreur est survenue, réessaie plus tard.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  });
}

// Sélecteur de couleur : met à jour l'id de variante caché dans le formulaire + le prix
// affiché, à partir des données de variantes injectées en JSON par la section produit.
function initVariantPickers() {
  document.querySelectorAll('[data-variant-picker]').forEach((picker) => {
    const variantsJson = picker.querySelector('[data-variant-json]');
    if (!variantsJson) return;
    const variants = JSON.parse(variantsJson.textContent);
    const form = picker.closest('[data-add-to-cart-form]') || document.querySelector('[data-add-to-cart-form]');
    const idInput = form?.querySelector('[name="id"]');
    const priceEl = document.querySelector('[data-product-price]');
    const legend = picker.querySelector('[data-variant-legend]');

    picker.querySelectorAll('[data-variant-option]').forEach((btn) => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('[data-variant-option]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const variantId = btn.dataset.variantId;
        const variant = variants.find((v) => String(v.id) === String(variantId));
        if (!variant) return;

        if (idInput) idInput.value = variant.id;
        if (legend) legend.textContent = variant.title;
        if (priceEl) priceEl.textContent = variant.price_formatted;
        window.dispatchEvent(new CustomEvent('novi:variant-changed', { detail: { variant } }));
      });
    });
  });
}

function initQuantityPickers() {
  document.querySelectorAll('[data-quantity-picker]').forEach((picker) => {
    const input = picker.querySelector('input');
    if (!input) return;
    picker.querySelectorAll('[data-quantity-decrease]').forEach((btn) =>
      btn.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
      }),
    );
    picker.querySelectorAll('[data-quantity-increase]').forEach((btn) =>
      btn.addEventListener('click', () => {
        input.value = parseInt(input.value || '1', 10) + 1;
      }),
    );
  });
}

// Sélecteur de bundle (Solo / Duo / Trio) : pilote la quantité réelle du formulaire et
// affiche un total/prix-unitaire recalculés côté client. La vraie remise (palier "Trio")
// est une remise automatique Shopify côté serveur — l'affichage ici ne fait que la
// refléter, il ne l'invente pas (le pourcentage et le seuil viennent des réglages de
// section, à garder synchronisés avec la remise automatique configurée dans l'admin).
function initBundleSelectors() {
  document.querySelectorAll('[data-bundle-selector]').forEach((root) => {
    const tiers = Array.from(root.querySelectorAll('[data-bundle-tier]'));
    if (tiers.length === 0) return;

    const form = root.closest('form');
    const quantityInput = form?.querySelector('[data-bundle-quantity-input]');
    const totalEl = document.querySelector('[data-bundle-total]');
    const perUnitEl = document.querySelector('[data-bundle-per-unit]');
    const currency = root.dataset.currency || 'EUR';
    const discountQty = Number(root.dataset.discountQty || 3);
    const discountFactor = Number(root.dataset.discountFactor || 1);

    const formatMoney = (cents) => {
      try {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(cents / 100);
      } catch {
        return `${(cents / 100).toFixed(2)} ${currency}`;
      }
    };

    const getUnitPriceCents = () => {
      const variantJson = document.querySelector('[data-variant-json]');
      const idInput = form?.querySelector('[name="id"]');
      if (variantJson && idInput) {
        try {
          const variants = JSON.parse(variantJson.textContent);
          const variant = variants.find((v) => String(v.id) === String(idInput.value));
          if (variant) return variant.price_cents;
        } catch {
          // fallback ci-dessous
        }
      }
      return Number(root.dataset.basePriceCents || 0);
    };

    const updateDisplay = (qty) => {
      const unit = getUnitPriceCents();
      const factor = qty >= discountQty ? discountFactor : 1;
      const total = Math.round(unit * qty * factor);

      tiers.forEach((tier) => {
        const tierQty = Number(tier.dataset.qty);
        const tierFactor = tierQty >= discountQty ? discountFactor : 1;
        const priceEl = tier.querySelector('[data-bundle-tier-price]');
        if (priceEl) priceEl.textContent = formatMoney(Math.round(unit * tierQty * tierFactor));
      });

      if (totalEl) totalEl.textContent = formatMoney(total);
      if (perUnitEl) perUnitEl.textContent = `${formatMoney(Math.round(total / qty))} / unité`;
      if (quantityInput) quantityInput.value = String(qty);
    };

    tiers.forEach((tier) => {
      tier.addEventListener('click', () => {
        tiers.forEach((t) => t.classList.remove('is-selected'));
        tier.classList.add('is-selected');
        updateDisplay(Number(tier.dataset.qty));
      });
    });

    window.addEventListener('novi:variant-changed', () => {
      const active = tiers.find((t) => t.classList.contains('is-selected')) || tiers[0];
      updateDisplay(Number(active.dataset.qty));
    });

    const initial = tiers.find((t) => t.classList.contains('is-selected')) || tiers[0];
    updateDisplay(Number(initial.dataset.qty));
  });
}

// Panier : boutons +/- et suppression, via l'API Cart AJAX, puis rechargement de la page
// pour refléter les nouveaux totaux (simple et fiable pour une première version).
function initCartLineActions() {
  document.querySelectorAll('[data-cart-quantity]').forEach((input) => {
    input.addEventListener('change', async () => {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: Number(input.dataset.line), quantity: Number(input.value) }),
      });
      window.location.reload();
    });
  });

  document.querySelectorAll('[data-cart-remove]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: Number(btn.dataset.line), quantity: 0 }),
      });
      window.location.reload();
    });
  });
}
