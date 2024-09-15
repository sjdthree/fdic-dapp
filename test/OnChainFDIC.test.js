// test/OnChainFDIC.test.js
const OnChainFDIC = artifacts.require('OnChainFDIC');

contract('OnChainFDIC', (accounts) => {
  const [regulator, depositor, bank, nonDepositor] = accounts;

  let fdicInstance;

  beforeEach(async () => {
    // Deploy the contract with the regulator account
    fdicInstance = await OnChainFDIC.new({ from: regulator });

    // Register the bank before each test
    await fdicInstance.registerBank(bank, { from: regulator });

    // Fund the insurance pool (contract balance) for testing insurance claims
    await fdicInstance.sendTransaction({
      from: regulator,
      value: web3.utils.toWei('10', 'ether'),
    });
  });

  it('should allow a user to deposit funds', async () => {
    const depositAmount = web3.utils.toWei('1', 'ether');

    // Depositor makes a deposit to the bank
    const tx = await fdicInstance.deposit(bank, {
      from: depositor,
      value: depositAmount,
    });

    // Check that the DepositMade event was emitted
    const event = tx.logs.find((log) => log.event === 'DepositMade');
    assert(event, 'DepositMade event was not emitted');

    // Verify depositor's balance in the contract
    const depositorData = await fdicInstance.deposits(depositor, bank);
    assert.equal(
      depositorData.amount.toString(),
      depositAmount,
      'Deposit amount mismatch'
    );
  });

  it('should allow a depositor to claim insurance after bank failure', async () => {
    const depositAmount = web3.utils.toWei('1', 'ether');

    // Depositor makes a deposit to the bank
    await fdicInstance.deposit(bank, {
      from: depositor,
      value: depositAmount,
    });

    // Simulate bank failure
    await fdicInstance.failBank(bank, { from: regulator });

    // Depositor attempts to claim insurance
    const initialBalance = web3.utils.toBN(await web3.eth.getBalance(depositor));

    const tx = await fdicInstance.claimInsurance(bank, { from: depositor });

    // Check that the CompensationPaid event was emitted
    const event = tx.logs.find((log) => log.event === 'CompensationPaid');
    assert(event, 'CompensationPaid event was not emitted');

    // Verify depositor's balance increased (considering gas costs)
    const finalBalance = web3.utils.toBN(await web3.eth.getBalance(depositor));
    const gasUsed = web3.utils.toBN(tx.receipt.gasUsed);
    const txDetails = await web3.eth.getTransaction(tx.tx);
    const gasPrice = web3.utils.toBN(txDetails.gasPrice);
    const gasCost = gasUsed.mul(gasPrice);

    const expectedBalance = initialBalance
      .add(web3.utils.toBN(depositAmount))
      .sub(gasCost);

    assert(
      finalBalance.eq(expectedBalance),
      'Depositor balance did not increase correctly after claiming insurance'
    );
  });

// test/OnChainFDIC.test.js
it('should not allow a non-depositor to claim insurance', async () => {
    // Simulate bank failure
    await fdicInstance.failBank(bank, { from: regulator });
  
    try {
      await fdicInstance.claimInsurance(bank, { from: nonDepositor });
      assert.fail('Non-depositor was able to claim insurance');
    } catch (error) {
      const expectedError = 'No insured amount to claim';
      assert(
        error.message.includes(expectedError),
        `Expected error message to include '${expectedError}', but got '${error.message}'`
      );
    }
  });

  // Add more tests as needed
});