import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config({ path: ".env" });



const ALCHEMY_CELO_API_KEY_URL = process.env.ALCHEMY_CELO_API_KEY_URL;

const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

 

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
    
    },
    alfajores: {
      url: process.env.ALCHEMY_CELO_API_KEY_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY,],
   },
    
  }, etherscan: {
    apiKey: process.env.API_KEY
  }
};
