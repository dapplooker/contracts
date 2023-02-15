require('dotenv').config()

const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    let proxy_contract_address: string;
    switch (upgradeHardhatObj.network.name){
        case 'polygon_mumbai':
            proxy_contract_address = process.env.MUMBAI_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'polygon':
            proxy_contract_address = process.env.POLYGON_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'goreli':
            proxy_contract_address = process.env.GORELI_PROXY_CONTRACT_ADDRESS!;
            break;
        case 'ethereum':
            proxy_contract_address = process.env.ETHEREUM_PROXY_CONTRACT_ADDRESS!;
            break;
        default:
            console.log("Incorrect network name.");
            return;
    }
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy(proxy_contract_address, contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
