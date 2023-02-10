const proxyHardhatObj = require("hardhat")

async function deployProxyContract() {
  const multiTokenPaymentGateway = await proxyHardhatObj.ethers.getContractFactory("MultiTokenPaymentGateway");
  const multiTokenPaymentGatewayDeploy = await proxyHardhatObj.upgrades.deployProxy(multiTokenPaymentGateway);
  await multiTokenPaymentGatewayDeploy.deployed();

  console.log(`Contract successfully deployed to ${multiTokenPaymentGatewayDeploy.address}`);
}

deployProxyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
