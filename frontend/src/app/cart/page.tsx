'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="pt-32 max-w-2xl mx-auto px-4 text-center pb-24">
        <FiShoppingCart size={64} className="mx-auto mb-6 opacity-20" style={{ color: 'var(--text-primary)' }} />
        <h1 className="font-display font-bold text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Add some delicious Telugu flavours to get started.</p>
        <Link href="/products" className="btn-ochre inline-flex items-center gap-2">
          Browse Products <FiArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-4xl sm:text-5xl mb-10"
          style={{ color: 'var(--text-primary)' }}
        >
          Your Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex items-center gap-4 card p-4"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{item.sku}</p>
                    <div className="flex items-center gap-3">
                      <button
                        id={`cart-dec-${item.productId}`}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:text-ochre transition-colors"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                      <button
                        id={`cart-inc-${item.productId}`}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:text-ochre transition-colors"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-lg text-ochre">₹{item.sellingPrice * item.quantity}</p>
                    <button
                      id={`cart-remove-${item.productId}`}
                      onClick={() => removeItem(item.productId)}
                      className="mt-2 text-clay hover:text-clay-dark transition-colors"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={clearCart} className="text-sm text-clay hover:underline mt-2">Clear cart</button>
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>
            <div className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="flex justify-between font-display font-bold text-lg pt-1" style={{ color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span className="text-ochre">₹{total}</span>
              </div>
            </div>

            {user ? (
              <Link
                id="cart-checkout-btn"
                href="/checkout"
                className="btn-primary w-full text-center flex items-center justify-center gap-2"
              >
                Proceed to Checkout <FiArrowRight size={16} />
              </Link>
            ) : (
              <button
                id="cart-signin-to-checkout-btn"
                onClick={() => setAuthOpen(true)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Sign In to Checkout <FiArrowRight size={16} />
              </button>
            )}
            <Link href="/products" className="block text-center text-sm mt-4 hover:text-ochre transition-colors" style={{ color: 'var(--text-secondary)' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
