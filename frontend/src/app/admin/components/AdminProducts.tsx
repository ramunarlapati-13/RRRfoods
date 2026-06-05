'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PRODUCTS } from '@/lib/products';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS); // fallback to seed data
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (!snap.empty) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        }
      } catch {
        // Firestore not yet configured — use seed data
      } finally {
        setLoadingDb(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted.');
    } catch {
      toast.error('Delete failed (Firestore not configured yet).');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Products</h2>
        <button id="admin-add-product-btn" className="btn-primary flex items-center gap-2 text-sm py-2">
          <FiPlus size={14} /> Add Product
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['SKU', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(loadingDb ? PRODUCTS : products).map((p) => (
                <tr key={p.id} className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-mono text-xs text-ochre">{p.sku}</td>
                  <td className="px-4 py-3 font-medium max-w-[180px] truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                  <td className="px-4 py-3 capitalize" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{p.sellingPrice}</span>
                    <span className="text-xs line-through ml-1" style={{ color: 'var(--text-secondary)' }}>₹{p.actualPrice}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ochre font-semibold">{p.rating} ⭐</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button id={`admin-edit-${p.id}`} className="p-1.5 hover:text-ochre transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <FiEdit2 size={14} />
                      </button>
                      <button id={`admin-delete-${p.id}`} onClick={() => handleDelete(p.id)} className="p-1.5 hover:text-clay transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
