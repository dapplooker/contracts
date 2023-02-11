require('dotenv').config()

const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy("0xd2736449c79b33151d633a77feEDc8555EBE1169", contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
