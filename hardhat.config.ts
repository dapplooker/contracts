require('dotenv').config()

import "@nomicfoundation/hardhat-toolbox";

require('@openzeppelin/hardhat-upgrades');


const config = {
    defaultNetwork: "polygon_mumbai",
    networks: {
        hardhat: {},
        polygon_mumbai: {
            url: "https://matic-mumbai.chainstacklabs.com/",
            accounts: [process.env.MUMBAI_DEPLOYER_PRIVATE_KEY!]
        },
        goerli: {
            url: "https://goerli.infura.io/v3/ff5bdb3ffa2b490ebf5bd48d179b5bbe",
            accounts: [process.env.GORELI_DEPLOYER_PRIVATE_KEY!]
        },
        ethereum: {
            url: "",
            accounts: [process.env.ETHEREUM_DEPLOYER_PRIVATE_KEY!]
        },
        polygon: {
            url: "",
            accounts: [process.env.POLYGON_DEPLOYER_PRIVATE_KEY!]
        }
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
            goerli: process.env.ETHERSCAN_API_KEY!
        }
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
