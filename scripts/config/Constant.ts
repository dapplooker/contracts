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
                "paymentVault": "0x69A9D7668966F5d9A939833d7697ed9C90BbB020",
                "userAddress": process.env.MUMBAI_USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.MUMBAI_USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.MUMBAI_DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.MUMBAI_RPC_URL!,
            },
            "goerli": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": "0x69A9D7668966F5d9A939833d7697ed9C90BbB020",
                "userAddress": process.env.GORELI_USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.GORELI_USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.GORELI_DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.GORELI_RPC_URL!,
            },
            "polygon": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": "0x69A9D7668966F5d9A939833d7697ed9C90BbB020",
                "userAddress": process.env.POLYGON_USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.POLYGON_USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.POLYGON_DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.POLYGON_RPC_URL!,
            },
            "ethereum": {
                "usdt": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "usdc": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "paymentVault": "0x69A9D7668966F5d9A939833d7697ed9C90BbB020",
                "userAddress": process.env.ETHEREUM_USER_WALLET_ADDRESS!,
                "userPrivateKey": process.env.ETHEREUM_USER_PRIVATE_KEY!,
                "deployerAddress": "0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172",
                "deployerPrivateKey": process.env.ETHEREUM_DEPLOYER_PRIVATE_KEY!,
                "rpcURL": process.env.ETHEREUM_RPC_URL!,
            }
        }
    }
}

export default new Constant();
