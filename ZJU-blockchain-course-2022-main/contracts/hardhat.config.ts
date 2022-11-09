import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '64dc49acc874fbb673a6771db592c3a257105f1a0bffd739f5ad170a0121cbc5',
        '505f347f00ea8217c3cff0162b117e73f0997094ef8edddd527538a82ca161e9',
        '9c89367d746a35fc6133ff2468d0c38eef1a737033c58a9004da0de5e3e70651'
      ]
    },
  },
};

export default config;
