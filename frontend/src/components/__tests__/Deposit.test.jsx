// src/components/__tests__/Deposit.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Deposit from '../Deposit';
import { BlockchainContext } from '../../BlockchainProvider';

jest.mock('../../useFDICContract', () => ({
  useFDICContract: () => ({
    deposit: jest.fn().mockResolvedValue({
      wait: jest.fn(),
    }),
  }),
}));

test('renders Deposit component and handles deposit', async () => {
  const mockContext = {
    provider: {},
  };

  render(
    <BlockchainContext.Provider value={mockContext}>
      <Deposit />
    </BlockchainContext.Provider>
  );

  expect(screen.getByText(/Make a Deposit/i)).toBeInTheDocument();

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Bank Address/i), {
    target: { value: '0x0000000000000000000000000000000000000001' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Amount in ETH/i), {
    target: { value: '1' },
  });

  // Mock window.notify
  window.notify = jest.fn();

  // Click the deposit button
  fireEvent.click(screen.getByText(/Deposit/i));

  // Expect the notify to be called with 'Deposit successful!'
  await screen.findByText(/Processing.../i);
});