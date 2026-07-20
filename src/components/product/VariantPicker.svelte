<script lang="ts">
  import { addToCart } from '@/stores/cart';

  export let title: string;
  export let sku: string;
  export let price: number;
  export let image: string;
  export let variants: { name: string; hex: string; sku: string; stock: number }[] = [];

  let selected = variants[0];
  let quantity = 1;
  let added = false;

  function handleAdd() {
    addToCart({
      sku: selected?.sku ?? sku,
      title,
      variant: selected?.name ?? '',
      price,
      quantity,
      image,
    });
    added = true;
    setTimeout(() => (added = false), 2000);
  }
</script>

<div class="flex flex-col gap-6">
  <fieldset>
    <legend class="text-ink text-sm font-semibold">Couleur — {selected?.name}</legend>
    <div class="mt-3 flex gap-3">
      {#each variants as variant}
        <button
          type="button"
          class="h-11 w-11 rounded-full border-2 transition-transform {selected?.name === variant.name
            ? 'border-brand scale-110'
            : 'border-border'}"
          style="background-color: {variant.hex}"
          aria-label={variant.name}
          aria-pressed={selected?.name === variant.name}
          on:click={() => (selected = variant)}
        ></button>
      {/each}
    </div>
  </fieldset>

  <div class="flex items-center gap-4">
    <label for="quantity" class="text-ink text-sm font-semibold">Quantité</label>
    <div class="border-border flex items-center rounded-brand border">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-lg"
        on:click={() => (quantity = Math.max(1, quantity - 1))}
        aria-label="Diminuer la quantité"
      >
        −
      </button>
      <span id="quantity" class="w-8 text-center text-sm" aria-live="polite">{quantity}</span>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-lg"
        on:click={() => (quantity += 1)}
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  </div>

  <button
    type="button"
    class="bg-brand hover:bg-brand-light inline-flex min-h-[44px] items-center justify-center rounded-brand px-7 py-3.5 text-base font-medium text-white transition-colors"
    on:click={handleAdd}
  >
    {added ? 'Ajouté au panier ✓' : 'Acheter maintenant'}
  </button>
  <p class="text-muted text-xs">Paiement sécurisé. Livraison sous 3 à 5 jours ouvrés.</p>
</div>
