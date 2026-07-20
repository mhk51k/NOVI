<script lang="ts">
  import { cartItems, cartTotal, removeFromCart, updateQuantity } from '@/stores/cart';
  import { formatPrice } from '@/lib/formatPrice';

  // Les atoms nanostores implémentent nativement l'interface de store Svelte ($cartItems fonctionne directement).
  const items = cartItems;
  $: total = cartTotal($items);
</script>

{#if $items.length === 0}
  <div class="border-border rounded-brand border border-dashed p-10 text-center">
    <p class="text-muted">Ton panier est vide pour le moment.</p>
    <a
      href="/produit"
      class="bg-brand mt-4 inline-flex min-h-[44px] items-center justify-center rounded-brand px-6 py-3 text-sm font-medium text-white"
    >
      Découvrir PULP
    </a>
  </div>
{:else}
  <ul class="divide-border flex flex-col divide-y">
    {#each $items as item (item.sku)}
      <li class="flex items-center gap-4 py-5">
        <img src={item.image} alt="" class="border-border h-20 w-20 rounded-brand border object-contain" />
        <div class="flex-1">
          <p class="text-ink font-semibold">{item.title}</p>
          <p class="text-muted text-sm">{item.variant}</p>
          <div class="border-border mt-2 flex w-fit items-center rounded-brand border">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center"
              on:click={() => updateQuantity(item.sku, item.quantity - 1)}
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span class="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center"
              on:click={() => updateQuantity(item.sku, item.quantity + 1)}
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span class="text-ink font-semibold">{formatPrice(item.price * item.quantity)}</span>
          <button type="button" class="text-muted hover:text-brand text-sm underline" on:click={() => removeFromCart(item.sku)}>
            Retirer
          </button>
        </div>
      </li>
    {/each}
  </ul>
  <div class="border-border mt-6 flex items-center justify-between border-t pt-6">
    <span class="text-ink text-lg font-semibold">Total</span>
    <span class="text-ink text-lg font-semibold">{formatPrice(total)}</span>
  </div>
{/if}
