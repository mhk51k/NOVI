<script lang="ts">
  import { cartItems, cartCount } from '@/stores/cart';

  // Les atoms nanostores implémentent nativement l'interface de store Svelte ($cartItems fonctionne directement).
  const items = cartItems;
</script>

<a
  href="/panier"
  class="border-border relative flex h-11 w-11 items-center justify-center rounded-brand border"
  aria-label={`Panier, ${cartCount($items)} article(s)`}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
  {#if cartCount($items) > 0}
    <span class="bg-brand absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white">
      {cartCount($items)}
    </span>
  {/if}
</a>
