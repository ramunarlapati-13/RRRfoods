'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowDown } from 'react-icons/fi';

export default function HeroVideo() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        aria-hidden="true"
      >
        {/* High-definition looping video showing spices, matching brand guidelines */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-spices-spilling-on-a-wooden-surface-34208-large.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-charcoal-900" />
      <div className="absolute inset-0 bg-hero-gradient opacity-50" />

      {/* Spice particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-ochre/60"
          style={{
            left: `${15 + i * 14}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-ochre font-display font-semibold text-sm uppercase tracking-[0.3em] mb-4"
        >
          Heritage · Authentic · Telugu
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-cream mb-3"
        >
          Taste the Soul of{' '}
          <span className="text-gradient-clay">Telugu</span>{' '}
          Kitchens
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-telugu text-2xl text-ochre/80 mb-2"
        >
          ఆర్ఆర్ఆర్ ఫుడ్స్
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-cream/70 text-lg max-w-xl mx-auto mb-10"
        >
          Hand-crafted pickles & traditional sweets from ancestral Telugu recipes —
          delivered fresh to your home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link id="hero-shop-btn" href="/products" className="btn-ochre text-base px-8 py-4">
            Shop Now
          </Link>
          <Link id="hero-sampler-btn" href="/sampler" className="btn-ghost text-base px-8 py-4">
            Build Your Heritage Box
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <FiArrowDown size={16} />
      </motion.div>
    </section>
  );
}
