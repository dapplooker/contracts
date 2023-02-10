const upgradeHardhatObj = require("hardhat")

async function deployUpgradeContract() {
    const contractFactory = await upgradeHardhatObj.ethers.getContractFactory("MultiTokenPaymentGateway");
    const contractUpgrade = await upgradeHardhatObj.upgrades.upgradeProxy("0x6fE11011840a0Dc12F901f26b93cd6d2b374f67D", contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

deployUpgradeContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
