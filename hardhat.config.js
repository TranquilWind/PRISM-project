// // hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");


module.exports = {
  networks: {
    zkEVM: {
      url: `https://rpc.cardona.zkevm-rpc.com`,
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};