'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HeritageBoxItem } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingCart, FiInfo } from 'react-icons/fi';

const MAX_ITEMS = 4;
const BOX_WEIGHT_PER_ITEM = 200; // grams
const LS_KEY = 'rkfoods_heritage_box';

const ELIGIBLE = PRODUCTS.filter((p) => p.category === 'pickles' || p.category === 'sweets').map(
  (p): HeritageBoxItem => ({
    productId: p.id,
    name: p.name,
    nameTeluguScript: p.nameTeluguScript,
    imageUrl: p.imageUrl,
    sellingPrice: p.sellingPrice,
    category: p.category as 'pickles' | 'sweets',
    weight: BOX_WEIGHT_PER_ITEM,
  })
);

export default function HeritageBoxSampler() {
  const { addItem } = useCart();
  const [box, setBox] = useState<HeritageBoxItem[]>([]);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try { setBox(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(box));
  }, [box]);

  const addToBox = (item: HeritageBoxItem) => {
    if (box.length >= MAX_ITEMS) {
      toast.error(`Your Heritage Box can hold max ${MAX_ITEMS} items.`);
      return;
    }
    if (box.find((b) => b.productId === item.productId)) {
      toast.error(`${item.name} is already in your box.`);
      return;
    }
    setBox((prev) => [...prev, item]);
    toast.success(`${item.name} added to Heritage Box! 🎁`);
  };

  const removeFromBox = (productId: string) =>
    setBox((prev) => prev.filter((i) => i.productId !== productId));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // Handle drag from catalog to box
    if (result.source.droppableId === 'catalog' && result.destination.droppableId === 'box') {
      const item = ELIGIBLE.find((e) => e.productId === result.draggableId);
      if (item) addToBox(item);
    }
    // Reorder inside box
    if (result.source.droppableId === 'box' && result.destination.droppableId === 'box') {
      setBox((prev) => {
        const next = [...prev];
        const [moved] = next.splice(result.source.index, 1);
        next.splice(result.destination!.index, 0, moved);
        return next;
      });
    }
  };

  const totalPrice = box.reduce((sum, i) => sum + i.sellingPrice, 0);
  const totalWeight = box.length * BOX_WEIGHT_PER_ITEM;

  const addBoxToCart = () => {
    if (box.length < 3) {
      toast.error('Add at least 3 items to complete your Heritage Box.');
      return;
    }
    box.forEach((item) =>
      addItem({ productId: item.productId, name: item.name, imageUrl: item.imageUrl, sellingPrice: item.sellingPrice, quantity: 1, sku: '' })
    );
    setBox([]);
    toast.success('Heritage Box added to cart! 🎁');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Catalog (draggable source) ── */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            Choose your items
            <span className="ml-2 text-sm font-normal text-ochre">drag or tap +</span>
          </h3>
          <Droppable droppableId="catalog" isDropDisabled>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {ELIGIBLE.map((item, idx) => (
                  <Draggable key={item.productId} draggableId={item.productId} index={idx}>
                    {(drag, snapshot) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        {...drag.dragHandleProps}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing ${
                          snapshot.isDragging
                            ? 'shadow-glow-ochre border-ochre/60 scale-105'
                            : 'border-transparent'
                        }`}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', ...drag.draggableProps.style }}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                          <p className="text-xs font-telugu" style={{ color: 'var(--text-secondary)' }}>{item.nameTeluguScript}</p>
                          <p className="text-xs text-ochre font-semibold">₹{item.sellingPrice}</p>
                        </div>
                        <button
                          id={`heritage-add-${item.productId}`}
                          onClick={() => addToBox(item)}
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-clay hover:bg-clay-light text-white flex items-center justify-center transition-colors"
                          aria-label={`Add ${item.name} to Heritage Box`}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* ── Heritage Box (drop target) ── */}
        <div className="sticky top-24">
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            Your Heritage Box 🎁
            <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
              {box.length}/{MAX_ITEMS} items
            </span>
          </h3>

          <Droppable droppableId="box">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[260px] rounded-2xl border-2 border-dashed p-4 transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? 'drop-target-active'
                    : 'border-white/10'
                }`}
                style={{ background: 'var(--bg-card)' }}
              >
                {box.length === 0 ? (
                  <div className="h-52 flex flex-col items-center justify-center text-center gap-3">
                    <span className="text-5xl">🫙</span>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Drag products here or tap <strong>+</strong> to fill your box<br />
                      <span className="text-xs">(3–4 items recommended)</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {box.map((item, idx) => (
                        <Draggable key={item.productId} draggableId={`box-${item.productId}`} index={idx}>
                          {(drag) => (
                            <motion.div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-center gap-3 p-2 rounded-xl"
                              style={{ background: 'var(--bg-mid)', ...drag.draggableProps.style }}
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="40px" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                <p className="text-xs text-ochre">₹{item.sellingPrice} · {item.weight}g</p>
                              </div>
                              <button
                                onClick={() => removeFromBox(item.productId)}
                                className="p-1.5 rounded-lg hover:bg-clay/20 text-clay transition-colors"
                                aria-label="Remove from box"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </div>
            )}
          </Droppable>

          {/* Summary */}
          {box.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 glass rounded-2xl"
            >
              <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                <span>Total Weight</span>
                <span>{totalWeight}g</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span className="text-ochre">₹{totalPrice}</span>
              </div>
              {box.length < 3 && (
                <div className="flex items-center gap-1.5 text-xs text-ochre/80 mb-3">
                  <FiInfo size={12} />
                  Add {3 - box.length} more item{3 - box.length > 1 ? 's' : ''} to unlock box checkout
                </div>
              )}
              <button
                id="heritage-box-checkout-btn"
                onClick={addBoxToCart}
                disabled={box.length < 3}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${
                  box.length >= 3
                    ? 'btn-ochre'
                    : 'opacity-40 cursor-not-allowed bg-gray-600 text-gray-300'
                }`}
              >
                <FiShoppingCart size={16} /> Add Box to Cart
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
