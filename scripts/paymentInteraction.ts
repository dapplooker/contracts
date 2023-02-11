import Web3 from 'web3';
import {contractABI} from './config/PaymentABI';
import {erc20TokenContractAbi} from './config/ERC20ABI';
import Constant from './config/Constant';

require('dotenv').config()

function sleep(ms: any) {
    console.log(`Sleeping for ${ms} ms.`);
    return new Promise(((resolve) => {
        setTimeout(resolve, ms);
    }));
}


class PaymentWrapper {
    private paymentInstance: any;

    private web3: any;

    constructor() {
        this.web3 = new Web3(Constant.rpcMumbaiURL);
        this.web3.eth.accounts.wallet.add(Constant.userPrivateKey);
        this.paymentInstance = new this.web3.eth.Contract(contractABI.abi as any, Constant.paymentContract);
    }

    public async approveFunds(tokenAddress: string, amount: bigint) {
        console.log("\n ======================= Starting approve funds transaction =======================");
        let tokenInstance = new this.web3.eth.Contract(erc20TokenContractAbi as any, Constant.chainLinkTokenAddress);
        let approveTransaction = tokenInstance.methods.approve(Constant.paymentContract, amount).encodeABI();
        const txHash = await this.sendTransaction(approveTransaction, Constant.userPrivateKey, Constant.chainLinkTokenAddress, "APPROVE");
        await this.waitForTransactionStatus(txHash, "APPROVE");
    }

    public async depositFunds(tokenAddress: string, amount: bigint) {
        console.log("\n ======================= Starting deposit funds transaction =======================");
        let depositCallEncoded = this.paymentInstance.methods.depositFunds(tokenAddress, amount).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, Constant.userPrivateKey, Constant.paymentContract, "DEPOSIT");
        await this.waitForTransactionStatus(txHash, "DEPOSIT");
    }

    public async withdrawFunds(tokenAddress: string, amount: bigint) {
        console.log("\n ======================= Starting withdraw funds transaction =======================");
        let depositCallEncoded = this.paymentInstance.methods.withdrawFunds(tokenAddress, amount).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, Constant.receiverPrivateKey, Constant.paymentContract, "WITHDRAW");
        await this.waitForTransactionStatus(txHash, "WITHDRAW");
    }

    private async sendTransaction(txDataEncoded: any, privateKey: string, toContract: string, operation: string) {
        let block = await this.web3.eth.getBlock('latest');
        let gasLimit = Math.round(block.gasLimit / block.transactions.length);

        const transactionParameters = {
            gas: gasLimit,
            to: toContract,
            data: txDataEncoded
        };

        try {
            const signedTx = await this.web3.eth.accounts.signTransaction(transactionParameters, privateKey);
            console.log(`${operation}: Signed transaction details: ${JSON.stringify(signedTx)}`);
            this.web3.eth.sendSignedTransaction(signedTx.rawTransaction,
                function (error: Error, hash: string){console.log(`Callback function error check: ${error}`)})
                .on( 'error' , function( error: any ) { console.error( error.message ); });
            return signedTx.transactionHash;
        } catch (error) {
            console.log(`${operation} Error: ${error}`);
        }
    }


    private async waitForTransactionStatus(txHash: string, operation: string) {
        while (true) {
            const txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
            if (txReceipt !== null) {
                console.log(`${operation} receipt: `, JSON.stringify(txReceipt));
                let receiptLogData = txReceipt.logs[0].data;
                console.log(`Data value ${this.decodeData(receiptLogData)}`)
                break;
            } else {
                console.log(`Waiting for ${operation} transaction receipt`);
                await sleep(1000);
            }
        }
    }
    private decodeData(receiptLogData: string){
        const reason = this.web3.utils.hexToNumberString(receiptLogData);
        return reason;
    }
}

async function doTransactions() {
    const paymentVault = new PaymentWrapper();
    await paymentVault.approveFunds(Constant.chainLinkTokenAddress, Constant.transferAmountInGWEI).then(() =>
        console.log(`Approve transaction successful. Approved funds to ${Constant.paymentContract}`)
    );
    await sleep(1000);
    await paymentVault.depositFunds(Constant.chainLinkTokenAddress, Constant.transferAmountInGWEI).then(() =>
        console.log(`Deposit transaction successful. Deposited funds to ${Constant.paymentContract}`)
    );
    await sleep(1000);
    await paymentVault.withdrawFunds(Constant.chainLinkTokenAddress, Constant.transferAmountInGWEI).then(() =>
        console.log(`Withdraw transaction successful. Withdrawn funds to ${Constant.ownerWalletAddress}`)
    );
}

doTransactions().then(r => console.log("Done"));
