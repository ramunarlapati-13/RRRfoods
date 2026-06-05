'use client';
import { motion } from 'framer-motion';
import { Category, DietFilter } from '@/lib/types';

interface Props {
  activeCategory: Category;
  dietFilter: DietFilter;
  onCategoryChange: (c: Category) => void;
  onDietChange: (d: DietFilter) => void;
  counts?: Record<string, number>;
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'pickles', label: 'Pickles', emoji: '🫙' },
  { id: 'sweets', label: 'Sweets', emoji: '🍯' },
  { id: 'meals', label: 'Meals', emoji: '🍛' },
];

export default function CategoryFilter({ activeCategory, dietFilter, onCategoryChange, onDietChange, counts }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Category tabs */}
      <div className="flex items-center gap-1 glass rounded-2xl p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => onCategoryChange(cat.id)}
            className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
            style={{ color: activeCategory === cat.id ? '#FAF9F6' : 'var(--text-secondary)' }}
          >
            {activeCategory === cat.id && (
              <motion.div
                layoutId="active-cat"
                className="absolute inset-0 bg-clay rounded-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {counts?.[cat.id] !== undefined && (
                <span className="text-xs opacity-60">({counts[cat.id]})</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Veg / Non-Veg toggle — shown only for pickles & meals */}
      {(activeCategory === 'pickles' || activeCategory === 'meals') && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 glass rounded-2xl p-1"
        >
          {(['all', 'veg', 'nonveg'] as DietFilter[]).map((d) => (
            <button
              key={d}
              id={`filter-diet-${d}`}
              onClick={() => onDietChange(d)}
              className="relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
              style={{ color: dietFilter === d ? '#FAF9F6' : 'var(--text-secondary)' }}
            >
              {dietFilter === d && (
                <motion.div
                  layoutId="active-diet"
                  className={`absolute inset-0 rounded-xl ${
                    d === 'veg' ? 'bg-green-600' : d === 'nonveg' ? 'bg-red-700' : 'bg-slate-700'
                  }`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {d === 'all' ? 'All' : d === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
