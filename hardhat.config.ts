require('dotenv').config()

import "@nomicfoundation/hardhat-toolbox";


const config = {
    defaultNetwork: "polygon_mumbai",
    networks: {
        hardhat: {},
        polygon_mumbai: {
            url: "https://matic-mumbai.chainstacklabs.com/",
            accounts: [process.env.DEPLOYER_PRIVATE_KEY!]
        }
    },
    etherscan: {
        apiKey: process.env.CHAINSCAN_API_KEY!,
    },
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};

export default config;
