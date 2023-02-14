require('dotenv').config()

const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy(process.env.PROXY_CONTRACT_ADDRESS, contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
