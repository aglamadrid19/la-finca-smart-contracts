// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = require('ethers');

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

  let wmaticContract;
  let laFincaStakingContract;
  let mangoToken

  let wmaticDeployed
  let laFincaStakingDeployed
  let mangoTokenDeployed

  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    mangoToken = await ethers.getContractFactory("MangoToken");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    mangoTokenDeployed = await mangoToken.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment and Testing Mango Token", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await mangoTokenDeployed.owner()).to.equal(owner.address);
    });

    // If the callback function is async, Mocha will `await` it.
    it("Should set total supply to 1,000,000", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.
  
        // Mango Token supply should be 0   
        expect(await mangoTokenDeployed.totalSupply()).to.equal(utils.parseUnits('1000000', baseUnit))
    });

    // If the callback function is async, Mocha will `await` it.
    it("Minting allowed by owner and Total Supply should be init supply + 50 and back", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.
  
        // Mango Token supply should be 0   
    
        await mangoTokenDeployed["mint(address,uint256)"](owner.address, utils.parseUnits('50', baseUnit))
        expect(await mangoTokenDeployed.totalSupply()).to.equal(utils.parseUnits('1000050', baseUnit))
    });

    it("Transfer funds with 0% fee to wallet 2 and back to wallet 3", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.
    
        await mangoTokenDeployed.transfer(addr1.address, utils.parseUnits('50', baseUnit))
        expect(await mangoTokenDeployed.balanceOf(addr1.address)).to.equal(utils.parseUnits('50', baseUnit))
        
        await mangoTokenDeployed.connect(addr1).transfer(addr2.address, utils.parseUnits('50', baseUnit))
        expect(await mangoTokenDeployed.balanceOf(addr2.address)).to.equal(utils.parseUnits('50', baseUnit))
        expect(await mangoTokenDeployed.balanceOf(addr1.address)).to.equal(utils.parseUnits('0', baseUnit))
        expect(await mangoTokenDeployed.balanceOf(owner.address)).to.equal(utils.parseUnits('999950', baseUnit)) 
    });
  });
});