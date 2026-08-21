import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter', () => {
  const mockOnCategoryChange = vi.fn();
  const mockOnDietChange = vi.fn();

  const defaultProps = {
    activeCategory: 'all' as const,
    dietFilter: 'all' as const,
    onCategoryChange: mockOnCategoryChange,
    onDietChange: mockOnDietChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all category buttons', () => {
    render(<CategoryFilter {...defaultProps} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pickles')).toBeInTheDocument();
    expect(screen.getByText('Sweets')).toBeInTheDocument();
    expect(screen.getByText('Meals')).toBeInTheDocument();
  });

  it('calls onCategoryChange when a category is clicked', () => {
    render(<CategoryFilter {...defaultProps} />);

    fireEvent.click(screen.getByText('Pickles'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('pickles');

    fireEvent.click(screen.getByText('Sweets'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('sweets');
  });

  it('shows diet filter when active category is pickles', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="pickles" />);

    expect(screen.getAllByText('All')[0]).toBeInTheDocument();
    expect(screen.getAllByText('All')[1]).toBeInTheDocument();
    expect(screen.getByText('🟢 Veg')).toBeInTheDocument();
    expect(screen.getByText('🔴 Non-Veg')).toBeInTheDocument();
  });

  it('shows diet filter when active category is meals', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="meals" />);

    expect(screen.getByText('🟢 Veg')).toBeInTheDocument();
    expect(screen.getByText('🔴 Non-Veg')).toBeInTheDocument();
  });

  it('hides diet filter when active category is sweets', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="sweets" />);

    expect(screen.queryByText('🟢 Veg')).not.toBeInTheDocument();
    expect(screen.queryByText('🔴 Non-Veg')).not.toBeInTheDocument();
  });

  it('hides diet filter when active category is all', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="all" />);

    // There is an "All" in category, but no Veg/Non-Veg
    expect(screen.queryByText('🟢 Veg')).not.toBeInTheDocument();
    expect(screen.queryByText('🔴 Non-Veg')).not.toBeInTheDocument();
  });

  it('calls onDietChange when a diet option is clicked', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="pickles" />);

    fireEvent.click(screen.getByText('🟢 Veg'));
    expect(mockOnDietChange).toHaveBeenCalledWith('veg');

    fireEvent.click(screen.getByText('🔴 Non-Veg'));
    expect(mockOnDietChange).toHaveBeenCalledWith('nonveg');

    // Need to click the specific diet filter "All" instead of Category "All"
    // Using test ID / closer query to avoid if statement
    const allDietButton = screen.getAllByText('All').find(el => el.closest('button')?.id === 'filter-diet-all');
    // We expect it to be defined so it throws if not found
    expect(allDietButton).toBeDefined();

    fireEvent.click(allDietButton!);
    expect(mockOnDietChange).toHaveBeenCalledWith('all');
  });

  it('displays counts when the counts prop is provided', () => {
    const counts = {
      all: 10,
      pickles: 5,
      sweets: 3,
      meals: 2,
    };

    render(<CategoryFilter {...defaultProps} counts={counts} />);

    expect(screen.getByText('(10)')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });
});
