// test/OnChainFDIC.test.js
const OnChainFDIC = artifacts.require('OnChainFDIC');

contract('OnChainFDIC', (accounts) => {
  const [depositor, bank, nonDepositor] = accounts;

  let fdicInstance;

  beforeEach(async () => {
    fdicInstance = await OnChainFDIC.new();
  });

  it('should allow a user to deposit funds', async () => {
    const depositAmount = web3.utils.toWei('1', 'ether');

    // Depositor makes a deposit to the bank
    const tx = await fdicInstance.deposit(bank, {
      from: depositor,
      value: depositAmount,
    });

    // Check that the Deposit event was emitted
    const event = tx.logs.find((log) => log.event === 'Deposit');
    assert(event, 'Deposit event was not emitted');

    // Verify depositor's balance in the contract
    const balance = await fdicInstance.deposits(depositor, bank);
    assert.equal(balance.toString(), depositAmount, 'Deposit amount mismatch');
  });

  it('should allow a depositor to claim insurance after bank failure', async () => {
    const depositAmount = web3.utils.toWei('1', 'ether');

    // Depositor makes a deposit to the bank
    await fdicInstance.deposit(bank, {
      from: depositor,
      value: depositAmount,
    });

    // Simulate bank failure by setting its balance to zero (you might need to adjust this based on your contract logic)
    // In this example, we'll assume the bank's balance is maintained in the contract
    // and we can set its failure status

    // For the test, we'll directly call a function to simulate bank failure
    // This function should only be callable by the contract owner or appropriate authority
    // Ensure your contract has such a function for testing purposes

    // Simulate bank failure (this function should exist in your contract for testing)
    // await fdicInstance.failBank(bank, { from: owner }); // Uncomment and adjust as needed

    // For the purpose of this test, we'll assume the bank has failed
    // Depositor attempts to claim insurance
    const initialDepositorBalance = await web3.eth.getBalance(depositor);

    const tx = await fdicInstance.claimInsurance(bank, { from: depositor });

    // Check that the InsuranceClaimed event was emitted
    const event = tx.logs.find((log) => log.event === 'InsuranceClaimed');
    assert(event, 'InsuranceClaimed event was not emitted');

    // Verify depositor's balance increased
    const finalDepositorBalance = await web3.eth.getBalance(depositor);
    assert(
      web3.utils.toBN(finalDepositorBalance).gt(web3.utils.toBN(initialDepositorBalance)),
      'Depositor balance did not increase after claiming insurance'
    );
  });

  it('should not allow a non-depositor to claim insurance', async () => {
    try {
      await fdicInstance.claimInsurance(bank, { from: nonDepositor });
      assert.fail('Non-depositor was able to claim insurance');
    } catch (error) {
      assert(
        error.message.includes('No deposit found'),
        'Incorrect error message when non-depositor attempts to claim insurance'
      );
    }
  });

  // Add more tests as needed
});