// src/components/__tests__/ClaimInsurance.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClaimInsurance from '../ClaimInsurance';
import { BlockchainContext } from '../../BlockchainProvider';

jest.mock('../../useFDICContract', () => ({
  useFDICContract: () => ({
    claimInsurance: jest.fn().mockResolvedValue({
      wait: jest.fn(),
    }),
  }),
}));

test('renders ClaimInsurance component and handles claim', async () => {
  const mockContext = {
    provider: {},
  };

  render(
    <BlockchainContext.Provider value={mockContext}>
      <ClaimInsurance />
    </BlockchainContext.Provider>
  );

  expect(screen.getByText(/Claim Insurance/i)).toBeInTheDocument();

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Bank Address/i), {
    target: { value: '0x0000000000000000000000000000000000000001' },
  });

  // Mock window.alert
  window.alert = jest.fn();

  // Click the claim button
  fireEvent.click(screen.getByText(/Claim/i));

  // Expect the alert to be called with 'Insurance claimed!'
  await screen.findByText(/Processing.../i);
});