'use client';
import Link from 'next/link';
import { FiPhone, FiMail, FiInstagram, FiYoutube } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-mid)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-clay-gradient flex items-center justify-center shadow-glow-clay">
                <span className="text-cream font-display font-black text-xl">R</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>RRR Foods</p>
                <p className="text-sm font-telugu" style={{ color: 'var(--text-secondary)' }}>ఆర్ఆర్ఆర్ ఫుడ్స్</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Heritage-first culinary brand delivering authentic Telugu pickles and traditional sweets
              from ancestral recipes to your doorstep.
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[
                { Icon: FiInstagram, href: '#' },
                { Icon: FiYoutube, href: 'https://m.youtube.com/@RRRFOODS-y4v' }
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, color: '#E5A93C' }}
                  className="p-2.5 glass rounded-xl transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4 text-ochre text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Pickles', href: '/products?category=pickles' },
                { label: 'Sweets', href: '/products?category=sweets' },
                { label: 'Heritage Box', href: '/sampler' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'My Orders', href: '/orders' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-ochre transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4 text-ochre text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  id="footer-phone-link"
                  href="tel:9704371867"
                  className="flex items-center gap-2 text-sm hover:text-ochre transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FiPhone size={14} />
                  9704371867
                </a>
              </li>
              <li>
                <a
                  id="footer-email-link"
                  href="mailto:support@rexplore.tech"
                  className="flex items-center gap-2 text-sm hover:text-ochre transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FiMail size={14} />
                  support@rexplore.tech
                </a>
              </li>
              <li>
                <p className="text-xs leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
                  Customer support managed by{' '}
                  <a
                    href="https://rexplore.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ochre hover:underline"
                  >
                    Rexplore Technologies
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <p>© 2026 Rexplore Technologies. All Rights Reserved.</p>
          <p>
            Central Portal:{' '}
            <a href="https://rexplore.tech" target="_blank" rel="noopener noreferrer" className="text-ochre hover:underline">
              rexplore.tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
