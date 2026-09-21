import { Product } from '@/lib/types';

export function calculateCategoryCounts(products: Product[]) {
  return products.reduce(
    (acc, p) => {
      acc.all += 1;
      if (p.category === 'pickles') {
        acc.pickles += 1;
      } else if (p.category === 'sweets') {
        acc.sweets += 1;
      } else if (p.category === 'meals') {
        acc.meals += 1;
      }
      return acc;
    },
    { all: 0, pickles: 0, sweets: 0, meals: 0 }
  );
}
