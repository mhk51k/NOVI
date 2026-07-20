import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string().default('EUR'),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    ),
    colorVariants: z.array(
      z.object({
        name: z.string(),
        hex: z.string(),
        sku: z.string(),
        stock: z.number(),
      }),
    ),
    specs: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
    stock: z.number(),
    sku: z.string(),
    featured: z.boolean().default(true),
  }),
});

export const collections = { products };
