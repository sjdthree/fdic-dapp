// src/App.js
import React from 'react';
import { BlockchainProvider } from './BlockchainProvider';
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';

function App() {
  return (
    <BlockchainProvider>
      <div className="App">
        <h1>On-Chain FDIC Insurance DApp</h1>
        <Deposit />
        <ClaimInsurance />
      </div>
    </BlockchainProvider>
  );
}

export default App;