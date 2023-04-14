const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = require('ethers');
const ether = require('@openzeppelin/test-helpers/src/ether');

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("La Finca MATIC Staking Test", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  const baseUnit = 18;

  const getBlockNumber = async () => {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(blockNumber);
  }

  let wmaticContract;
  let laFincaStakingContract;
  let mangoToken

  let wmaticDeployed
  let laFincaStakingDeployed
  let mangoTokenDeployed

  let owner;
  let addr1;
  let addr2;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    mangoToken = await ethers.getContractFactory("MangoToken");
    wmaticContract = await ethers.getContractFactory("WMATIC");
    laFinca = await ethers.getContractFactory("LaFincaMaticStaking");

    [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    mangoTokenDeployed = await mangoToken.deploy();
    wmaticDeployed = await wmaticContract.deploy();
    
    // console.log(blockNumber)
    laFincaDeployed = await laFinca.deploy(
        wmaticDeployed.address,
        mangoTokenDeployed.address,
        '1000000000000000000',
        3,
        50,
        owner.address,
        wmaticDeployed.address
    );
    await mangoTokenDeployed.transfer(laFincaDeployed.address, utils.parseUnits('100000', baseUnit));
  });

  // You can nest describe calls to create subsections.
  describe("Deployment and Testing La Finca Staking", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.
    // If the callback function is async, Mocha will `await` it.
    it("Deposit and withdraw test addr1", async function () {
        // Deposit from Addr1
        await laFincaDeployed.connect(addr1).deposit({value: utils.parseUnits("5", baseUnit)});
        // Should not have rewards on same staking block
        expect(await laFincaDeployed.pendingReward(addr1.address)).to.equal(utils.parseUnits('0', baseUnit))
        await laFincaDeployed.connect(addr2).deposit({value: utils.parseUnits("5", baseUnit)});
        // Expect total amount of WMATIC
        expect(await wmaticDeployed.balanceOf(laFincaDeployed.address)).to.equal(utils.parseUnits('10', baseUnit))
        // Get Reward for Addr1 and expect equals to 1.5
        await laFincaDeployed.connect(addr1).deposit();
        expect(await mangoTokenDeployed.balanceOf(addr1.address)).to.equal(utils.parseUnits('1.5', baseUnit))
        expect(await laFincaDeployed.pendingReward(addr2.address)).to.equal(utils.parseUnits('0.5', baseUnit))
    });
  });
});