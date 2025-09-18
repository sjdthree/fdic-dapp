# Contracts Documentation

## OnChainFDIC.sol
This Solidity smart contract implements the FDIC insurance logic. It includes the following key components:

### Structures
- **Bank**: Stores information about a bank, including whether it is registered and failed, as well as its total deposits.
- **Depositor**: Stores information about a depositor's deposit in a specific bank, including the amount deposited and the insured amount.

### Functions
- `registerBank(address _bank)`: Registers a new bank with the regulator. Only the regulator can perform this action.
- `deposit(address _bank)`: Allows a depositor to make a deposit into a registered bank. The function calculates the insured amount based on the insurance limit and updates the total deposits for both the bank and the depositor.
- `failBank(address _bank)`: Marks a bank as failed by the regulator. Only the regulator can perform this action.
- `claimInsurance(address _bank)`: Allows a depositor to claim insurance if their associated bank has failed. The function ensures that the depositor's insured amount is not reset until after the compensation is paid.

### Events
- `BankRegistered(address indexed bank)`: Emitted when a new bank is registered.
- `DepositMade(address indexed depositor, address indexed bank, uint256 amount)`: Emitted when a deposit is made into a bank.
- `BankFailed(address indexed bank)`: Emitted when a bank fails.
- `CompensationPaid(address indexed depositor, address indexed bank, uint256 amount)`: Emitted when compensation is paid to a depositor.

### Modifiers
- `onlyRegulator()`: Ensures that only the regulator can perform certain actions in the contract.