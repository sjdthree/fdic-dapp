// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OnChainFDIC {
    struct Bank {
        bool isRegistered;
        bool isFailed;
        uint256 totalDeposits;
    }

    struct Depositor {
        uint256 amount;
        uint256 insuredAmount;
    }

    address public regulator;
    uint256 public insuranceLimit = 250000 ether; // Insurance limit
    mapping(address => Bank) public banks;
    mapping(address => mapping(address => Depositor)) public deposits; // depositor => bank => Depositor

    event BankRegistered(address indexed bank);
    event DepositMade(address indexed depositor, address indexed bank, uint256 amount);
    event BankFailed(address indexed bank);
    event CompensationPaid(address indexed depositor, address indexed bank, uint256 amount);

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator can perform this action");
        _;
    }

    constructor() {
        regulator = msg.sender;
    }

    // Function for regulator to register banks
    function registerBank(address _bank) external onlyRegulator {
        banks[_bank].isRegistered = true;
        emit BankRegistered(_bank);
    }

    // Depositors deposit funds into banks
    function deposit(address _bank) external payable {
        require(banks[_bank].isRegistered, "Bank is not registered");
        require(!banks[_bank].isFailed, "Bank has failed");

        deposits[msg.sender][_bank].amount += msg.value;
        banks[_bank].totalDeposits += msg.value;

        // Calculate insured amount (up to insurance limit)
        uint256 totalDeposited = deposits[msg.sender][_bank].amount;
        if (totalDeposited <= insuranceLimit) {
            deposits[msg.sender][_bank].insuredAmount = totalDeposited;
        } else {
            deposits[msg.sender][_bank].insuredAmount = insuranceLimit;
        }

        emit DepositMade(msg.sender, _bank, msg.value);
    }

    // Regulator marks bank as failed
    function failBank(address _bank) external onlyRegulator {
        require(banks[_bank].isRegistered, "Bank is not registered");
        banks[_bank].isFailed = true;
        emit BankFailed(_bank);
    }

    // Depositors claim insurance after bank failure
    function claimInsurance(address _bank) external {
        require(banks[_bank].isFailed, "Bank has not failed");
        uint256 compensation = deposits[msg.sender][_bank].insuredAmount;
        require(compensation > 0, "No insured amount to claim");

        // Reset depositor's insured amount to prevent re-entrancy
        deposits[msg.sender][_bank].insuredAmount = 0;

        // Pay compensation
        payable(msg.sender).transfer(compensation);
        emit CompensationPaid(msg.sender, _bank, compensation);
    }

    // Function to fund the insurance pool (could be from bank premiums)
    receive() external payable {}

    // Function to check the contract balance (insurance pool)
    function getInsurancePoolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}