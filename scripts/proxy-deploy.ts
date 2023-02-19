require('dotenv').config()

const proxyHardhatObj = require("hardhat")

async function deployProxyContract() {
  const paymentVaultGateway = await proxyHardhatObj.ethers.getContractFactory("PaymentVault");
  const paymentVaultGatewayDeploy = await proxyHardhatObj.upgrades.deployProxy(paymentVaultGateway);
  await paymentVaultGatewayDeploy.deployed();

  console.log(`Contract successfully deployed to ${paymentVaultGatewayDeploy.address}`);
}

deployProxyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
