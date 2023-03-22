# Contracts

## ERC20 Contract
https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20


## PaymentVault Contract
- It's generic contract for payment of ERC20 tokens
- Users can pay for services in ERC20 tokens like USDT/USDC

## Deploying the Contracts

Install all dependencies with command `npm i`.

Update the `.env` file with following details:

### Environment details:
- `RPC_URL`: RPC url of network.
- `USER_PRIVATE_KEY`: Private key of user's wallet from which payment has to be done. [Not required for during deployment]
- `USER_WALLET_ADDRESS`: User's wallet address from which payment has to be done. [Not required for during deployment]
- `DEPLOYER_PRIVATE_KEY`: Private key of deployer wallet which is used for deploying the contract
- `NEW_OWNER_PRIVATE_KEY`: Private key of new owner's wallet. [Not required for during deployment]
- `NEW_OWNER_WALLET_ADDRESS`: New owner's wallet address. [Not required for during deployment]
- `PROXY_CONTRACT_ADDRESS`: Contract address of proxy contract, which we get after deployment. [Required during upgrade]
- `CHAINSCAN_API_KEY`: Etherscan API key, used by hardhat for deployment and verification.

### Compile the code:
`npx hardhat compile`

### Deploy proxy:
Proxy deployment should happen only once:

`npx hardhat run scripts/proxy-deploy.ts --network <network-name>`

### Upgrade contract:
Update the environment variable `PROXY_CONTRACT_ADDRESS` with proxy contract.

`npx hardhat run scripts/upgrade-deploy.ts --network <network-name>`

### Verify contract:
Verify proxy contract after each deployment for upgrade

`npx hardhat verify --network <network-name> <proxy-contract-address>`


## Contract unit testing after deployment

After deployment of contract, update the `.env` file as required, details below. 

### Environment file details for script testing:
- `RPC_URL`: RPC url of network
- `USER_PRIVATE_KEY`: Private key of user's wallet from which payment has to be done
- `USER_WALLET_ADDRESS`: User's wallet address from which payment has to be done
- `DEPLOYER_PRIVATE_KEY`: Private key of deployer wallet which is used for deploying the contract
- `NEW_OWNER_PRIVATE_KEY`: Private key of new owner's wallet. This is used for testing transferOwner function. 
- `NEW_OWNER_WALLET_ADDRESS`: New owner's wallet address. This is used for testing transferOwner function
- `PROXY_CONTRACT_ADDRESS`: Contract address of proxy contract, which we get after deployment.
- `CHAINSCAN_API_KEY`: Etherscan API key, used by hardhat for deployment and verification.

### Run following command to test the contract for network and token
`ts-node scripts/paymentInteraction.ts <network_name> <token_name>`

Supported testnet network names: `mumbai` and `goerli`.

Supported mainnet network names [Not recommended to run]: `polygon` and `ethereum`.

Supported token name: `usdt` and `usdc`
