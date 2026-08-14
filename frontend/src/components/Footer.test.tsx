// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders the brand section correctly', () => {
    render(<Footer />);
    expect(screen.getByText('RRR Foods')).toBeInTheDocument();
    expect(screen.getByText('ఆర్ఆర్ఆర్ ఫుడ్స్')).toBeInTheDocument();
    expect(
      screen.getByText(/Heritage-first culinary brand delivering authentic Telugu pickles/i)
    ).toBeInTheDocument();
  });

  it('renders quick links correctly', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();

    const allProductsLink = screen.getByText('All Products');
    expect(allProductsLink).toHaveAttribute('href', '/products');

    const picklesLink = screen.getByText('Pickles');
    expect(picklesLink).toHaveAttribute('href', '/products?category=pickles');

    const sweetsLink = screen.getByText('Sweets');
    expect(sweetsLink).toHaveAttribute('href', '/products?category=sweets');

    const heritageBoxLink = screen.getByText('Heritage Box');
    expect(heritageBoxLink).toHaveAttribute('href', '/sampler');

    const myOrdersLink = screen.getByText('My Orders');
    expect(myOrdersLink).toHaveAttribute('href', '/orders');
  });

  it('renders contact information correctly', () => {
    render(<Footer />);
    expect(screen.getByText('Contact')).toBeInTheDocument();

    const phoneLink = screen.getByText('9704371867').closest('a');
    expect(phoneLink).toHaveAttribute('href', 'tel:9704371867');
    expect(phoneLink).toHaveAttribute('id', 'footer-phone-link');

    const emailLink = screen.getByText('support@rexplore.tech').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:support@rexplore.tech');
    expect(emailLink).toHaveAttribute('id', 'footer-email-link');
  });

  it('renders social links correctly', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    const instaLink = links.find(l => l.getAttribute('href') === '#');
    const ytLink = links.find(l => l.getAttribute('href') === 'https://m.youtube.com/@RRRFOODS-y4v');

    expect(instaLink).toBeInTheDocument();
    expect(instaLink).toHaveAttribute('target', '_blank');

    expect(ytLink).toBeInTheDocument();
    expect(ytLink).toHaveAttribute('target', '_blank');
  });

  it('renders footer bottom section correctly', () => {
    render(<Footer />);
    expect(screen.getByText('© 2026 Rexplore Technologies. All Rights Reserved.')).toBeInTheDocument();
    const centralPortalLink = screen.getByText('rexplore.tech');
    expect(centralPortalLink).toHaveAttribute('href', 'https://rexplore.tech');
  });
});
