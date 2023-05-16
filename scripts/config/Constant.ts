class Constant {
    chainID = '0x13881';

    get transferAmountInGWEI(): bigint {
        return BigInt(2000000000000000000);
    }

    get defaultGasLimit(): number {
        return 100000;
    }

    public get contractAddress(): Record<string, Record<string, string>> {
        return {
            "mumbai": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PAYMENT_VAULT_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": process.env.DEPLOYER_WALLET_ADDRESS!,
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "newWalletPrivateKey": process.env.NEW_OWNER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "goerli": {
                "usdt": "0x828ACA29CF9201488551B01E2Fb3191C0b56eAfb",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PAYMENT_VAULT_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": process.env.DEPLOYER_WALLET_ADDRESS!,
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "newWalletPrivateKey": process.env.NEW_OWNER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "goerliArbitrum": {
                "usdt": "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28",
                "usdc": "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28",
                "paymentVault": process.env.PAYMENT_VAULT_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": process.env.DEPLOYER_WALLET_ADDRESS!,
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "newWalletPrivateKey": process.env.NEW_OWNER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "polygon": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PAYMENT_VAULT_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": process.env.DEPLOYER_WALLET_ADDRESS!,
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "newWalletPrivateKey": process.env.NEW_OWNER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "ethereum": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PAYMENT_VAULT_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": process.env.DEPLOYER_WALLET_ADDRESS!,
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "newWalletPrivateKey": process.env.NEW_OWNER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            }
        }
    }
}

export default new Constant();
