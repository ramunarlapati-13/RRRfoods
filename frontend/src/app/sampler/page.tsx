'use client';
import { motion } from 'framer-motion';
import HeritageBoxSampler from '@/components/HeritageBoxSampler';

export default function SamplerPage() {
  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-7xl mb-4 animate-float">🎁</div>
        <p className="text-ochre font-semibold text-sm uppercase tracking-widest mb-3">
          Personalised Gifting
        </p>
        <h1 className="font-display font-black text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
          Build Your Heritage Box
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Drag & drop (or tap +) to mix 3–4 of your favourite pickles and sweets into
          one beautiful gift box. Price and weight update in real time.
        </p>
      </motion.div>

      <HeritageBoxSampler />
    </div>
  );
}
