// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: OnChainFDIC.sol


pragma solidity ^0.8.20;


contract ERC20FDIC {
    struct Bank {
        bool isRegistered;
        bool isFailed;
        mapping(address => uint256) totalDeposits;
    }

    struct Depositor {
        uint256 amount;
        uint256 insuredAmount;
        address token;
    }

    uint256 public insurancePoolBalance;

    address[] public regulators; // an array to store multiple regulators
    address[] public bankArray;
    Depositor[] public depositArray;

    mapping(address => bool) public isRegulator; // mapping to check if an address is a regulator
    mapping(address => Bank) public banks;
    mapping(address => mapping(address => mapping(address => Depositor))) public deposits; // depositor => bank => Depositor

    event BankRegistered(address indexed bank);
    event DepositMade(address indexed depositor, address indexed bank, address indexed token, uint256 amount);
    event BankFailed(address indexed bank);
    event BankUnfailed(address indexed bank);
    event CompensationPaid(address indexed depositor, address indexed bank, address indexed token, uint256 amount);
    event RegulatorAdded(address indexed regulator);
    event RegulatorRemoved(address indexed regulator);


    modifier onlyRegulator() {
        require(isRegulator[msg.sender], "Only regulator can perform this action");
        _;
    }

    constructor() {
        isRegulator[msg.sender] = true;
        regulators.push(msg.sender);
        insurancePoolBalance = 0;
    }

    // Function to add a new regulator
    function addRegulator(address _newRegulator) external onlyRegulator {
        require(_newRegulator != address(0), "Invalid address");
        require(!isRegulator[_newRegulator], "Address is already a regulator");
        
        isRegulator[_newRegulator] = true;
        regulators.push(_newRegulator);
        
        emit RegulatorAdded(_newRegulator);
    }

    // Function to remove a regulator
    function removeRegulator(address _regulator) external onlyRegulator {
        require(isRegulator[_regulator], "Not a regulator");
        
        isRegulator[_regulator] = false;
        
        // Optionally, you can remove from the regulators array
        for (uint256 i = 0; i < regulators.length; i++) {
            if (regulators[i] == _regulator) {
                regulators[i] = regulators[regulators.length - 1]; // Move the last element to the removed spot
                regulators.pop(); // Remove the last element
                break; // Exit the loop once removed
            }
        }
        
        emit RegulatorRemoved(_regulator);
    }

    // Function to get all regulators
    function getRegulators() public view returns (address[] memory) {
        return regulators;
    }

    // Function for regulator to register banks
    function registerBank(address _bank) external onlyRegulator {
        if(!banks[_bank].isRegistered) {
            banks[_bank].isRegistered = true;
            bankArray.push(_bank);
        } 
        emit BankRegistered(_bank);
    }

    // Function for regulator to get all banks
    function getBanks() public view returns (address[] memory) {
        return bankArray;
    }
    

    // Function for regulator to get all banks
    function getFailedBanks() public view returns (address[] memory) {
        // Create a temporary array to hold the addresses of failed banks
        address[] memory failedBanksTemp = new address[](bankArray.length);
        uint256 count = 0;

        // Iterate over all bank addresses and collect failed ones
        for (uint256 i = 0; i < bankArray.length; i++) {
            if (banks[bankArray[i]].isFailed) {
                failedBanksTemp[count] = bankArray[i];
                count++;
            }
        }

        // Create a fixed-size array to return with only the failed banks
        address[] memory failedBanks = new address[](count);
        for (uint256 j = 0; j < count; j++) {
            failedBanks[j] = failedBanksTemp[j];
        }

        return failedBanks; // Return the array of failed banks
    }


    // Depositors deposit funds into banks
    function deposit(address _bank, address _token, uint256 _amount) external {
        require(banks[_bank].isRegistered, "Bank is not registered");
        require(!banks[_bank].isFailed, "Bank has failed");

        // Transfer the ERC20 tokens from the sender to this contract
        uint256 currentAllowance = IERC20(_token).allowance(msg.sender, address(this));
        uint256 newAllowance = currentAllowance + _amount;
        IERC20(_token).approve(address(this), newAllowance);

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        deposits[msg.sender][_bank][_token].amount += _amount;
        deposits[msg.sender][_bank][_token].insuredAmount += _amount;
        banks[_bank].totalDeposits[_token] += _amount;
        insurancePoolBalance += _amount;

        emit DepositMade(msg.sender, _bank, _token, _amount);
    }

    // Regulator marks bank as failed
    function failBank(address _bank) external onlyRegulator {
        require(banks[_bank].isRegistered, "Bank is not registered");
        banks[_bank].isFailed = true;
        emit BankFailed(_bank);
    }

        // Regulator unfails bank
    function unfailBank(address _bank) external onlyRegulator {
        require(banks[_bank].isRegistered, "Bank is not registered");
        require(banks[_bank].isFailed, "Bank has not failed");
        banks[_bank].isFailed = false;
        emit BankUnfailed(_bank);
    }

    // Depositors claim insurance after bank failure
    function claimInsurance(address _bank, address _token) external {
        require(banks[_bank].isFailed, "Bank has not failed");
        uint256 compensation = deposits[msg.sender][_bank][_token].insuredAmount;
        require(compensation > 0, "No insured amount to claim");

        // Pay compensation in ERC-20 tokens
        IERC20(_token).transfer( msg.sender, compensation);
        insurancePoolBalance -= compensation;
        emit CompensationPaid(msg.sender, _bank, _token, compensation);

        // Reset depositor's insured amount to prevent re-entrancy
        deposits[msg.sender][_bank][_token].insuredAmount = 0;

    }

    // Function to fund the insurance pool (could be from bank premiums)
    receive() external payable {}

    // Function to check the contract balance (insurance pool)
    function getInsurancePoolBalance() external view returns (uint256) {
        return insurancePoolBalance;
    }
}