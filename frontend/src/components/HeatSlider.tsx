'use client';
import { motion } from 'framer-motion';

interface Props {
  level: number; // 1-10
  category: 'pickles' | 'sweets' | 'meals';
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const PICKLE_LABELS = ['Mellow', 'Mild', 'Medium', 'Bold', 'Spicy', 'Hot', 'Very Hot', 'Fiery', 'Authentic Telugu', 'Fiery Guntur'];
const SWEET_LABELS = ['Lightly Sweet', 'Mildly Sweet', 'Balanced', 'Sweet', 'Rich', 'Very Sweet', 'Indulgent', 'Richly Indulgent', 'Decadent', 'Intensely Sweet'];

const PICKLE_EMOJI = ['😌', '🙂', '😊', '🌶️', '🌶️', '🔥', '🔥', '🔥🔥', '🔥🔥🔥', '💀'];
const SWEET_EMOJI = ['😊', '🍬', '🍬', '🍯', '🍯', '🍩', '🍩', '🍰', '🍰', '🎂'];

export default function HeatSlider({ level, category, onChange, readOnly = false }: Props) {
  const isPickle = category === 'pickles';
  const labels = isPickle ? PICKLE_LABELS : SWEET_LABELS;
  const emojis = isPickle ? PICKLE_EMOJI : SWEET_EMOJI;
  const idx = Math.min(Math.max(Math.round(level) - 1, 0), 9);

  const pct = ((level - 1) / 9) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold font-display" style={{ color: 'var(--text-primary)' }}>
          {isPickle ? '🌶️ Spice Level' : '🍬 Sweetness Level'}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-ochre">
          <span>{emojis[idx]}</span>
          <span>{labels[idx]}</span>
        </span>
      </div>

      <div className="relative h-4 flex items-center">
        {/* Track */}
        <div className="heat-track w-full h-3 rounded-full" />

        {/* Filled portion (dark overlay from right) */}
        <div
          className="absolute top-0.5 right-0 h-2 rounded-r-full bg-black/40 transition-all duration-200"
          style={{ width: `${100 - pct}%` }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg border-2 border-ochre cursor-pointer"
          style={{ left: `calc(${pct}% - 10px)` }}
          whileHover={readOnly ? {} : { scale: 1.2 }}
        />

        {/* Accessible range input */}
        {!readOnly && (
          <input
            id="heat-slider-input"
            type="range"
            min={1}
            max={10}
            value={level}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={isPickle ? 'Spice level slider' : 'Sweetness level slider'}
          />
        )}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>{isPickle ? 'Mellow' : 'Lightly Sweet'}</span>
        <span>{isPickle ? 'Fiery Guntur 🔥' : 'Intensely Sweet 🎂'}</span>
      </div>
    </div>
  );
}
