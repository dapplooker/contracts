class Constant {
    chainID = '0x13881';

    get transferAmountInGWEI(): bigint {
        return BigInt(2000000000000000000);
    }

    public get contractAddress(): Record<string, Record<string, string>> {
        return {
            "mumbai": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PROXY_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "goerli": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PROXY_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "polygon": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PROXY_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            },
            "ethereum": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": process.env.PROXY_CONTRACT_ADDRESS!,
                "userAddress": process.env.USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.RPC_URL!,
            }
        }
    }
}

export default new Constant();
