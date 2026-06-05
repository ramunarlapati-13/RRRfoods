'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { PRODUCTS } from '@/lib/products';
import { Category, DietFilter } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ProductsGrid() {
  const params = useSearchParams();
  const initialCat = (params.get('category') as Category) || 'all';
  const [category, setCategory] = useState<Category>(initialCat);
  const [diet, setDiet] = useState<DietFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (diet !== 'all' && p.dietType !== diet) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: PRODUCTS.length,
    pickles: PRODUCTS.filter((p) => p.category === 'pickles').length,
    sweets: PRODUCTS.filter((p) => p.category === 'sweets').length,
    meals: 0,
  };

  return (
    <div>
      {/* Search */}
      <input
        id="products-search-input"
        type="search"
        placeholder="Search pickles, sweets…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-80 border rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-ochre transition-colors mb-6 bg-transparent"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
      />

      <CategoryFilter
        activeCategory={category}
        dietFilter={diet}
        onCategoryChange={setCategory}
        onDietChange={setDiet}
        counts={counts}
      />

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-5xl">🔍</span>
            <p className="mt-4 text-lg font-medium">No products found.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-ochre font-semibold text-sm uppercase tracking-widest mb-2">Our Catalog</p>
        <h1 className="font-display font-black text-5xl sm:text-6xl" style={{ color: 'var(--text-primary)' }}>
          All Products
        </h1>
        <p className="mt-3 text-lg max-w-lg" style={{ color: 'var(--text-secondary)' }}>
          Authentic Telugu flavours, packed with tradition. Choose your favourites.
        </p>
      </motion.div>
      <Suspense fallback={<div className="skeleton h-8 w-48 rounded-xl" />}>
        <ProductsGrid />
      </Suspense>
    </div>
  );
}
