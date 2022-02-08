// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const MangoToken = await hre.ethers.getContractFactory("MangoToken");
  const mangoToken = await MangoToken.deploy();

  const WMATIC = await hre.ethers.getContractFactory("WMATIC");
  const wmatic = await WMATIC.deploy();

  await wmatic.deployed()
  await mangoToken.deployed();

  const LaFinca = await hre.ethers.getContractFactory("LaFincaMaticStaking")
  const lafinca = await LaFinca.deploy(
    wmatic.address,
    mangoToken.address,
    '1000000000000000000',
    24640195,
    30000000,
    "0xb8AF02b8b712b6eB9dD05Abc4A9dc68ffC8C4c7c",
    wmatic.address
  )

  lafinca.deployed()

  // Wait 3 seconds before trying to verify   
  await new Promise(resolve => setTimeout(resolve, 50000));

  await hre.run("verify:verify", {
    address: lafinca.address,
    constructorArguments: [
        wmatic.address,
        mangoToken.address,
        '1000000000000000000',
        24640195,
        30000000,
        "0xb8AF02b8b712b6eB9dD05Abc4A9dc68ffC8C4c7c",
        wmatic.address
    ],
  });

  console.log("MangoToken deployed and verified to:", mangoToken.address);
  console.log("WMATIC deployed and verified to:", wmatic.address)
  console.log("LaFinca deployed and verified to:", lafinca.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
