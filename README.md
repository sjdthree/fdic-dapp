# README.md

# On-Chain FDIC Insurance DApp

This repository contains the code for an **On-Chain FDIC Insurance Decentralized Application (DApp)**, which simulates the insurance mechanism provided by the Federal Deposit Insurance Corporation (FDIC) using Ethereum smart contracts and a React.js frontend.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Overview

The On-Chain FDIC Insurance DApp is a conceptual demonstration of how deposit insurance can be managed in a decentralized manner using blockchain technology. It allows:

- **Regulators** to register banks and mark them as failed.
- **Depositors** to deposit funds into registered banks.
- **Depositors** to claim insurance if a bank fails.

**Note:** This project is for educational purposes and should not be used in production environments.

## Features

- **Smart Contract**: Implements the FDIC insurance logic using Solidity.
- **Frontend DApp**: Allows users to interact with the smart contract via a user-friendly interface.
- **Ethers.js v6 Integration**: Updated to work with the latest version of Ethers.js.
- **Wallet Support**: Compatible with MetaMask and can be extended to support other wallets.

## Technologies Used

- **Solidity**: Smart contract development.
- **Truffle**: Development environment for Ethereum.
- **React.js**: Frontend framework for building the user interface.
- **Ethers.js v6**: Library for interacting with the Ethereum blockchain.
- **Ganache**: Local blockchain for development and testing.
- **MetaMask**: Browser extension for interacting with the Ethereum network.

## Project Structure

```
fdic-dapp/
├── contracts/
│   └── OnChainFDIC.sol
├── migrations/
│   └── 1_initial_migration.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── abis/
│   │   │   └── OnChainFDIC.json
│   │   ├── components/
│   │   │   ├── ClaimInsurance.js
│   │   │   └── Deposit.js
│   │   ├── BlockchainProvider.js
│   │   ├── useFDICContract.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ...
├── build/
│   └── contracts/
│       └── OnChainFDIC.json
├── truffle-config.js
├── package.json
├── package-lock.json
├── node_modules/
├── .git/
├── .gitignore
├── README.md
└── INSTALL.md
```

## Installation and Setup

Please refer to the [INSTALL.md](INSTALL.md) file for detailed installation and deployment instructions.

## Usage

After installation and deployment, you can interact with the DApp by:

- **Depositing Funds**: Enter the bank's address and the amount you wish to deposit.
- **Claiming Insurance**: If a bank fails, you can claim insurance up to the insured amount.
- **Regulator Actions**: Using Truffle Console, you can register banks and mark them as failed.

## License

This project is licensed under the MIT License.

## Acknowledgements

- **Ethereum Community**: For extensive documentation and support.
- **Truffle Suite**: For simplifying Ethereum development.
- **Ethers.js**: For providing a robust library to interact with Ethereum.
- **OpenAI's ChatGPT**: For assistance in code generation and documentation.

- **NSF Award**: This material is based upon work supported by the National Science Foundation under Award No. 2337771 (SBIR Phase I).  
Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect the views of the National Science Foundation.
---
