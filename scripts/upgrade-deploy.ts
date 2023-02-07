const hre = require("hardhat")
const { ethers, upgrades } = require('hardhat');

async function _main() {
    const contractFactory = await hre.ethers.getContractFactory("MultiTokenPaymentGateway");
    const contractUpgrade = await upgrades.upgradeProxy("0x94c63c354Ef6D35510a393d9C71AA617b38216BD", contractFactory);
    console.log(`Contract upgraded deployed to ${contractUpgrade.address}`);
}

_main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
