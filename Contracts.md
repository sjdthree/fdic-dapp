## migrating contract

truffle migrate --network amoy

## Working with contract

const ERC20FDIC= await artifacts.require("ERC20FDIC");
let instance = await ERC20FDIC.at("0xF82A6E67f3dB7edf32e99fA031759806552A3BF4");
instance.registerBank("0xa4A0084dE9DD57151E50E65A0A459f19131038dF")
instance.deposit("0xa4A0084dE9DD57151E50E65A0A459f19131038dF","0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",5000000000)

// Replace with your token's ABI, for example, from ERC20 standard
const erc20ABI = [{"constant":false,"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"indexed":true,"internalType":"address","name":"bank","type":"address"}],"name":"BankFailed","payable":false,"type":"event"},{"constant":false,"inputs":[{"indexed":true,"internalType":"address","name":"bank","type":"address"}],"name":"BankRegistered","payable":false,"type":"event"},{"constant":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":true,"internalType":"address","name":"bank","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompensationPaid","payable":false,"type":"event"},{"constant":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":true,"internalType":"address","name":"bank","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DepositMade","payable":false,"type":"event"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"}],"name":"banks","outputs":[{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"bool","name":"isFailed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"_bank","type":"address"},{"indexed":false,"internalType":"address","name":"_token","type":"address"}],"name":"claimInsurance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"_bank","type":"address"},{"indexed":false,"internalType":"address","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"insuredAmount","type":"uint256"},{"internalType":"address","name":"token","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"_bank","type":"address"}],"name":"failBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getInsurancePoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"indexed":false,"internalType":"address","name":"_bank","type":"address"}],"name":"registerBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"regulator","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"payable":false,"stateMutability":"payable","type":"receive"}]

// Replace with your deployed contract address
const tokenAddress = "0x43B8F9ACd8bF1b9F20D630AFfe54dF019938A4ed";

const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);

const owner = "0x3C565c6bC265cE063bf793F4260918165F598D31"; // Replace with the owner's address
const spender = "0xF82A6E67f3dB7edf32e99fA031759806552A3BF4"; // Replace with the spender's address

const allowanceAmount = await tokenContract.methods.allowance(owner, spender).call();

await tokenContract.methods.approve(owner, 25000000000).send({ from: owner, gasPrice: 50000000000 });
