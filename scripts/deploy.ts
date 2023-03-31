require('dotenv').config()

const hardhatObj = require("hardhat")

async function deployProxyContract() {
  const paymentVaultGateway = await hardhatObj.ethers.getContractFactory("PaymentVault");
  const paymentVaultGatewayDeploy = await paymentVaultGateway.deploy();
  await paymentVaultGatewayDeploy.deployed();

  console.log(`Contract successfully deployed to ${paymentVaultGatewayDeploy.address}`);
}

deployProxyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
