// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeatSlider from './HeatSlider';
import '@testing-library/jest-dom';

describe('HeatSlider', () => {
  it('renders correctly', () => {
    render(<HeatSlider level={5} category="pickles" />);
    expect(screen.getByText('🌶️ Spice Level')).toBeInTheDocument();
  });

  describe('Edge cases for level bounds', () => {
    it('handles negative level', () => {
      render(<HeatSlider level={-5} category="pickles" />);
      // Level should be clamped to 1
      // Level 1: index 0 -> 'Mellow' and '😌'
      expect(screen.getAllByText('Mellow').length).toBeGreaterThan(0);
      expect(screen.getByText('😌')).toBeInTheDocument();
    });

    it('handles level 0', () => {
      render(<HeatSlider level={0} category="pickles" />);
      // Level should be clamped to 1
      // Level 1: index 0 -> 'Mellow' and '😌'
      expect(screen.getAllByText('Mellow').length).toBeGreaterThan(0);
      expect(screen.getByText('😌')).toBeInTheDocument();
    });

    it('handles level > 10', () => {
      render(<HeatSlider level={15} category="pickles" />);
      // Level should be clamped to 10
      // Level 10: index 9 -> 'Fiery Guntur' and '💀'
      expect(screen.getByText('Fiery Guntur')).toBeInTheDocument();
      expect(screen.getByText('💀')).toBeInTheDocument();
    });

    it('handles floating point values properly (rounds to nearest integer)', () => {
      // 5.4 should round to 5 -> index 4 -> 'Spicy' and '🌶️'
      const { unmount } = render(<HeatSlider level={5.4} category="pickles" />);
      expect(screen.getByText('Spicy')).toBeInTheDocument();

      unmount();

      // 5.5 should round to 6 -> index 5 -> 'Hot' and '🔥'
      render(<HeatSlider level={5.5} category="pickles" />);
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('handles sweet category with out of bounds values', () => {
      render(<HeatSlider level={15} category="sweets" />);
      expect(screen.getByText('Intensely Sweet')).toBeInTheDocument();
      expect(screen.getByText('🎂')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onChange with correct value when slider is moved', () => {
      const mockOnChange = vi.fn();
      render(<HeatSlider level={5} category="pickles" onChange={mockOnChange} />);

      const slider = screen.getByLabelText('Spice level slider');
      fireEvent.change(slider, { target: { value: '8' } });

      expect(mockOnChange).toHaveBeenCalledWith(8);
    });

    it('does not render input when readOnly is true', () => {
      render(<HeatSlider level={5} category="pickles" readOnly />);

      const slider = screen.queryByLabelText('Spice level slider');
      expect(slider).not.toBeInTheDocument();
    });
  });
});
