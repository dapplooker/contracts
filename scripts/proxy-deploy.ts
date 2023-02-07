const hardhat = require("hardhat")

async function main() {
  const multiTokenPaymentGateway = await hardhat.ethers.getContractFactory("VaultTesting");
  const multiTokenPaymentGatewayDeploy = await multiTokenPaymentGateway.deploy();
  await multiTokenPaymentGatewayDeploy.deployed();

  console.log(`Contract successfully deployed to ${multiTokenPaymentGatewayDeploy.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
