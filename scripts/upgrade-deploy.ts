require('dotenv').config()

const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    let proxyContractAddress: string = process.env.PROXY_CONTRACT_ADDRESS!;
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy(proxyContractAddress, contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
