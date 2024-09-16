// frontend/src/__mocks__/@web3auth/modal.js

export const Web3Auth = jest.fn().mockImplementation(() => {
    return {
      initModal: jest.fn(),
      connect: jest.fn(),
      logout: jest.fn(),
      provider: null,
    };
  });