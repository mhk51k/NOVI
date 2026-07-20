import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  sku: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export const cartItems = persistentAtom<CartItem[]>('novi-cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addToCart(item: CartItem): void {
  const items = cartItems.get();
  const existing = items.find((i) => i.sku === item.sku);

  if (existing) {
    cartItems.set(
      items.map((i) => (i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i)),
    );
  } else {
    cartItems.set([...items, item]);
  }
}

export function removeFromCart(sku: string): void {
  cartItems.set(cartItems.get().filter((i) => i.sku !== sku));
}

export function updateQuantity(sku: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(sku);
    return;
  }
  cartItems.set(cartItems.get().map((i) => (i.sku === sku ? { ...i, quantity } : i)));
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
