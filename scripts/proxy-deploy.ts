const hre = require("hardhat")
const { ethers, upgrades } = require('hardhat');

async function main() {
  const multiTokenPaymentGateway = await hre.ethers.getContractFactory("MultiTokenPaymentGateway");
  const multiTokenPaymentGatewayDeploy = await upgrades.deployProxy(multiTokenPaymentGateway);
  await multiTokenPaymentGatewayDeploy.deployed();

  console.log(`Contract successfully deployed to ${multiTokenPaymentGatewayDeploy.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
