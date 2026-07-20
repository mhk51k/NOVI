import type { APIRoute } from 'astro';

export const prerender = false;

// Stub volontaire : la session Stripe Checkout n'est pas encore branchée sur cette itération.
// À implémenter ici (jamais côté client) avec la clé secrète Stripe une fois le paiement prêt.
export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({ error: "Le paiement n'est pas encore activé sur cette version du site." }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  );
};
