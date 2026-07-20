<script lang="ts">
  export let navItems: { href: string; label: string }[] = [];
  let open = false;

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }
</script>

<button
  class="border-border flex h-11 w-11 items-center justify-center rounded-brand border lg:hidden"
  aria-expanded={open}
  aria-controls="mobile-nav-panel"
  aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
  on:click={toggle}
>
  {#if open}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  {:else}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  {/if}
</button>

{#if open}
  <div class="fixed inset-0 z-50 lg:hidden">
    <button class="bg-ink/40 absolute inset-0" aria-label="Fermer le menu" on:click={close}></button>
    <nav
      id="mobile-nav-panel"
      class="bg-surface absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-1 p-6 shadow-xl"
      aria-label="Navigation mobile"
    >
      <button
        class="border-border mb-6 ml-auto flex h-11 w-11 items-center justify-center rounded-brand border"
        aria-label="Fermer le menu"
        on:click={close}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {#each navItems as item}
        <a href={item.href} class="text-ink hover:bg-muted/10 rounded-brand px-3 py-3 text-base font-medium" on:click={close}>
          {item.label}
        </a>
      {/each}
      <a
        href="/produit"
        class="bg-brand mt-4 inline-flex min-h-[44px] items-center justify-center rounded-brand px-5 py-3 text-sm font-medium text-white"
        on:click={close}
      >
        Acheter maintenant
      </a>
    </nav>
  </div>
{/if}
