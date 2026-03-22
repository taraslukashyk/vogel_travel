import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders logo and navigation links', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    // Check for logo
    const logo = getByAltText(/Vogel Logo/i);
    expect(logo).toBeDefined();
    
    // Check for main nav links
    expect(getByText(/ПРО НАС/i)).toBeDefined();
    expect(getByText(/ПРОПОЗИЦІЇ/i)).toBeDefined();
    expect(getByText(/СЕРВІСИ/i)).toBeDefined();
  });

  it('shows contact button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const contactBtn = getByText(/ЗВ'ЯЖІТЬСЯ З НАМИ/i);
    expect(contactBtn).toBeDefined();
  });
});
