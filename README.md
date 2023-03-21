# Contracts

## ERC20 Contract
https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20


## PaymentVault Contract
- It's generic contract for payment of ERC20 tokens
- Users can pay for services in ERC20 tokens like USDT/USDC

## Deploying the Contracts
Install all dependencies with command `npm i`.

Update the `.env` file and compile the code:
`npx hardhat compile`

#### Deploy proxy:
Proxy deployment should happen only once:

`npx hardhat run scripts/proxy-deploy.ts --network <network-name>`

#### Upgrade contract:
Update the environment variable `PROXY_CONTRACT_ADDRESS` with proxy contract.
`npx hardhat run scripts/upgrade-deploy.ts --network <network-name>`

#### Verify contract:
Verify proxy contract after each deployment for upgrade
`npx hardhat verify --network <network-name> <proxy-contract-address>`
