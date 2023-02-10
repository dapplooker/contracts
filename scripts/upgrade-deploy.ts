const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("PaymentVault");
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy("0xC8ADf3859ca4eDC5726e16962e51E67321888EB8", contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
