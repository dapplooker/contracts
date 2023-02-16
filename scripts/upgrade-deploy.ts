require('dotenv').config()

const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    let proxyContractAddress: string;
    switch (upgradeHardhatObj.network.name){
        case 'polygon_mumbai':
            proxyContractAddress = process.env.MUMBAI_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'polygon':
            proxyContractAddress = process.env.POLYGON_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'goerli':
            proxyContractAddress = process.env.GORELI_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'ethereum':
            proxyContractAddress = process.env.ETHEREUM_PROXY_CONTRACT_ADDRESS!;
            break;
        default:
            console.log("Incorrect network name.");
            return;
    }
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy(proxyContractAddress, contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
