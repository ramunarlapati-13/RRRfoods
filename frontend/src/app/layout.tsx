import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Ramakrishna Foods – రామకృష్ణ ఫుడ్స్ | Authentic Telugu Pickles & Sweets',
  description:
    'Order authentic Telugu pickles (Avakaya, Gongura, Nimma) and traditional sweets (Pootharekulu, Bandar Laddu) directly from Ramakrishna Foods. Free delivery across India.',
  keywords: ['Telugu pickles', 'Avakaya', 'Gongura', 'Pootharekulu', 'Bandar Laddu', 'Andhra pickles', 'online grocery'],
  openGraph: {
    title: 'Ramakrishna Foods – Authentic Telugu Pickles & Sweets',
    description: 'Heritage-first culinary brand delivering traditional Telugu flavours to your doorstep.',
    url: 'https://ramakrishnafoods.telugu.in',
    siteName: 'Ramakrishna Foods',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&family=Noto+Sans+Telugu:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1E1E1E',
                  color: '#FAF9F6',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                },
                success: { iconTheme: { primary: '#E5A93C', secondary: '#1E1E1E' } },
                error: { iconTheme: { primary: '#8B261E', secondary: '#FAF9F6' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
