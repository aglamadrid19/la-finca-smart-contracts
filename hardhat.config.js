require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.7.3",
                settings: {
                    optimizer: {
                    enabled: true,
                    runs: 200
                    }
                },
            },
            {
                version: "0.4.26",
                settings: {
                    optimizer: {
                    enabled: true,
                    runs: 200
                    }
                },
            }
        ]
    },
    networks: {
        hardhat: {
        },
        // mumbai: {
        //     url: process.env.POLYGON_MUMBAI_RPC,
        //     accounts:[process.env.PRIVATE_KEY],
        // },
    },
    etherscan: {
        apiKey: "VQV1PV11ADUA97QBINHU4ZEQNIQF5TIKQ4",
    },
};