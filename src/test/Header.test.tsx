import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    // Check for logo
    const logo = screen.getByAltText(/Vogel Logo/i);
    expect(logo).toBeDefined();
    
    // Check for main nav links
    expect(screen.getByText(/ПРО НАС/i)).toBeDefined();
    expect(screen.getByText(/ПРОПОЗИЦІЇ/i)).toBeDefined();
    expect(screen.getByText(/СЕРВІСИ/i)).toBeDefined();
  });

  it('shows contact button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const contactBtn = screen.getByText(/ЗВ'ЯЖІТЬСЯ З НАМИ/i);
    expect(contactBtn).toBeDefined();
  });
});
