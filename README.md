# contracts
DappLooker Contracts


**ERC20**: https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20


## Deploy proxy and upgraded contract
#### Compile the code: 
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
