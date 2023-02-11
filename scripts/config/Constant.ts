class Constant {
    chainID = '0x13881';

    get rpcMumbaiURL(): string {
        return 'https://rpc-mumbai.maticvigil.com/';
    }

    get rpcGoerliURL(): string {
        return 'https://rpc-mumbai.maticvigil.com/';
    }

    get paymentContract(): string {
        return '0x6fE11011840a0Dc12F901f26b93cd6d2b374f67D';
    }

    get userAddress(): string {
        return '0xb12FD2D441f192e2067627Dbde7833e9083f6CA2';
    }

    get chainLinkTokenAddress(): string {
        return '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
    }

    get userPrivateKey(): string {
        return process.env.USER_PRIVATE_KEY!;
    }

    get receiverPrivateKey(): string {
        return process.env.USER_PRIVATE_KEY!;
    }

    get ownerWalletAddress(): string {
        return '0x25563e07Bfb35c21938A9890d3A3ac2B2D47D172';
    }

    get transferAmountInGWEI(): bigint {
        return BigInt(2000000000000000000);
    }
}

export default new Constant();
