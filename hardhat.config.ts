require('dotenv').config()

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('@openzeppelin/hardhat-upgrades');


const config: HardhatUserConfig = {
    defaultNetwork: "polygon_mumbai",
    networks: {
      hardhat: {
      },
      polygon_mumbai: {
        url: "https://matic-mumbai.chainstacklabs.com/",
        accounts: [process.env.DEPLOYER_PRIVATE_KEY!]
      }
    },
    etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY!
    },
    solidity: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
};

export default config;
