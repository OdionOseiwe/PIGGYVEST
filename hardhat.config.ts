import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("hardhat-tracer");


require("dotenv").config({ path: ".env" });



const ALCHEMY_CELO_API_KEY_URL = process.env.ALCHEMY_CELO_API_KEY_URL;

const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

 

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/e7af8fc766b941c498bc770af5246568",
        blockNumber: 14390000,
      },
      chainId: 1,
    },
    alfajores: {
      url: process.env.ALCHEMY_CELO_API_KEY_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY,],
   },
    
  }, etherscan: {
    apiKey: process.env.API_KEY
  }
};
