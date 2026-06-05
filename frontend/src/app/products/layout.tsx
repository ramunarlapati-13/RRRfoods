import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products – Ramakrishna Foods | Telugu Pickles & Sweets',
  description: 'Browse our complete catalog of authentic Telugu pickles (Avakaya, Gongura) and traditional sweets (Pootharekulu, Bandar Laddu).',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
