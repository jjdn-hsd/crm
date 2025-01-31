import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Activities from './Activities';
import '@testing-library/jest-dom';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

describe('Activities', () => {
  it('renders activities page', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Add Activity')).toBeInTheDocument();
  });

  it('opens add activity modal', () => {
    render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );
    
    const addButton = screen.getByText('Add Activity');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});