import Web3 from 'web3';
import {contractABI} from './config/PaymentABI';
import {erc20TokenContractAbi} from './config/ERC20ABI';
import Constant from './config/Constant';
import upgradeHardhatObj from "hardhat";
import assert from "assert";
import BigNumber from "bignumber.js";

require('dotenv').config()

const args = process.argv.slice(2);

function sleep(ms: any) {
    console.log(`Sleeping for ${ms} ms.`);
    return new Promise(((resolve) => {
        setTimeout(resolve, ms);
    }));
}


class PaymentWrapper {
    private paymentInstance: any;

    private web3: any;

    private tokenContractAddress: string;

    private networkRPCURL: string;

    private paymentContract: string;

    private userWalletAddress: string;

    private userPrivateKey: string;

    private deployerWalletAddress: string;

    private deployerPrivateKey: string;

    private newWalletPrivateKey: string;


    constructor(networkName: string, tokenName: string) {
        this.tokenContractAddress = Constant.contractAddress[networkName][tokenName];
        this.networkRPCURL = Constant.contractAddress[networkName]["rpcURL"];
        this.paymentContract = Constant.contractAddress[networkName]["paymentVault"];
        this.userWalletAddress = Constant.contractAddress[networkName]["userAddress"];
        this.userPrivateKey = Constant.contractAddress[networkName]["userPrivateKey"];
        this.deployerWalletAddress = Constant.contractAddress[networkName]["deployerAddress"];
        this.deployerPrivateKey = Constant.contractAddress[networkName]["deployerPrivateKey"];
        this.newWalletPrivateKey = Constant.contractAddress[networkName]["newWalletPrivateKey"];

        this.web3 = new Web3(this.networkRPCURL);
        this.web3.eth.accounts.wallet.add(this.userPrivateKey);
        this.paymentInstance = new this.web3.eth.Contract(contractABI.abi as any, this.paymentContract);
    }

    private async _checkAllowance(ownerAddress: string, spenderAddress: string): Promise<bigint> {
        const oThis = this;
        let allowedAmount: bigint = BigInt(0);
        let tokenInstance = new this.web3.eth.Contract(erc20TokenContractAbi as any, oThis.tokenContractAddress);
        await tokenInstance.methods.allowance(ownerAddress, spenderAddress)
            .call(function (err: any, res: any) {
            if (err) {
                console.log("An error occurred", err)
                return 0;
            }
            console.log("The allowance is: ", res);
            allowedAmount = res;
        })
        return allowedAmount;
    }

    private async _checkTokenBalance(accountAddress: string): Promise<bigint> {
        const oThis = this;
        let balanceOfAccount: bigint = BigInt(0);
        let tokenInstance = new this.web3.eth.Contract(erc20TokenContractAbi as any, oThis.tokenContractAddress);
        await tokenInstance.methods.balanceOf(accountAddress)
            .call(function (err: any, res: any) {
                if (err) {
                    console.log("An error occurred", err)
                    return 0;
                }
                console.log("The balance is: ", res);
                balanceOfAccount = res;
            })
        return balanceOfAccount;
    }

    private async _checkOwnerUpdate(): Promise<string> {
        const oThis = this;
        let balanceOfAccount: string = "";
        let tokenInstance = new this.web3.eth.Contract(contractABI.abi as any, oThis.paymentContract);
        tokenInstance.methods.owner()
            .call(function (err: any, res: any) {
                if (err) {
                    console.log("An error occurred", err)
                    return 0;
                }
                console.log("The owner is: ", res);
                balanceOfAccount = res;
            })
        return balanceOfAccount;
    }

    public async approveFunds(amount: bigint) {
        const oThis = this;
        console.log("\n ======================= Starting approve funds transaction =======================");
        let allowedAmountBefore = await oThis._checkAllowance(oThis.userWalletAddress, oThis.paymentContract);

        let tokenInstance = new this.web3.eth.Contract(erc20TokenContractAbi as any, oThis.tokenContractAddress);
        let approveTransaction = tokenInstance.methods.approve(oThis.paymentContract, amount).encodeABI();
        const txHash = await this.sendTransaction(approveTransaction, oThis.userPrivateKey, oThis.tokenContractAddress, "APPROVE");
        await this.waitForTransactionStatus(txHash, "APPROVE");

        await sleep(3000);
        let allowedAmountAfter = await oThis._checkAllowance(oThis.userWalletAddress, oThis.paymentContract);
        let diffNumber = new BigNumber(allowedAmountAfter.toString()).minus(allowedAmountBefore.toString());
        assert(diffNumber.toNumber() >= BigInt(0), `Total allowed amount ${allowedAmountAfter} is not as expected`);
    }

    public async depositFunds(amount: bigint) {
        const oThis = this;
        console.log("\n ======================= Starting deposit funds transaction =======================");
        let balanceOfAccountBefore = await oThis._checkTokenBalance(oThis.paymentContract);
        let depositCallEncoded = this.paymentInstance.methods.deposit(oThis.tokenContractAddress, amount).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, oThis.userPrivateKey, oThis.paymentContract, "DEPOSIT");
        await this.waitForTransactionStatus(txHash, "DEPOSIT");

        await sleep(3000);
        let balanceOfAccountAfter = await oThis._checkTokenBalance(oThis.paymentContract);
        let diffNumber = new BigNumber(balanceOfAccountAfter.toString()).minus(balanceOfAccountBefore.toString());
        assert(diffNumber.isEqualTo(amount.toString()), `Total balance ${balanceOfAccountAfter} is not as expected`);
    }

    public async withdrawFunds(amount: bigint) {
        const oThis = this;
        console.log("\n ======================= Starting withdraw funds transaction =======================");
        let balanceOfAccountBefore = await oThis._checkTokenBalance(oThis.deployerWalletAddress);
        let depositCallEncoded = this.paymentInstance.methods.withdraw(oThis.tokenContractAddress, amount).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, oThis.deployerPrivateKey, oThis.paymentContract, "WITHDRAW");
        await this.waitForTransactionStatus(txHash, "WITHDRAW");

        await sleep(3000);
        let balanceOfAccountAfter = await oThis._checkTokenBalance(oThis.deployerWalletAddress);
        let diffNumber = new BigNumber(balanceOfAccountAfter.toString()).minus(balanceOfAccountBefore.toString());
        assert(diffNumber.isEqualTo(amount.toString()), `Total balance of owner is not as expected`);
    }

    public async transferOwnership(newOwnerAddress: string) {
        const oThis = this;
        console.log("\n ======================= Starting transfer ownership funds transaction =======================");
        let depositCallEncoded = this.paymentInstance.methods.transferOwnership(newOwnerAddress).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, oThis.deployerPrivateKey, oThis.paymentContract, "TRANSFER_OWNERSHIP");
        await this.waitForTransactionStatus(txHash, "TRANSFER_OWNERSHIP");
        let updatedOwner = await oThis._checkOwnerUpdate();
        assert(updatedOwner != newOwnerAddress, `Ownership not transferred as expected.`);
    }

    public async revertOwnership() {
        const oThis = this;
        console.log("\n ======================= Starting transfer ownership funds transaction =======================");
        let depositCallEncoded = this.paymentInstance.methods.transferOwnership(oThis.deployerWalletAddress).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, oThis.newWalletPrivateKey, oThis.paymentContract, "TRANSFER_OWNERSHIP");
        await this.waitForTransactionStatus(txHash, "TRANSFER_OWNERSHIP");
        let updatedOwner = await oThis._checkOwnerUpdate();
        assert(updatedOwner !== oThis.deployerWalletAddress, `Ownership not reverted as expected`);
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

async function doTransactions(networkName: string, tokenName: string) {
    const paymentVault = new PaymentWrapper(networkName, tokenName);
    await paymentVault.approveFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Approve transaction done. Approved funds to ${Constant.contractAddress[networkName][tokenName]}`)
    );
    await sleep(1000);
    await paymentVault.depositFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Deposit transaction done. Deposited funds to ${Constant.contractAddress[networkName][tokenName]}`)
    );
    await sleep(1000);
    await paymentVault.withdrawFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Withdraw transaction done. Withdrawn funds to ${Constant.contractAddress[networkName]["deployerAddress"]}`)
    );
    await sleep(1000);
    await paymentVault.transferOwnership(process.env.NEW_OWNER_WALLET_ADDRESS!).then(() =>
        console.log(`Transfer ownership transaction done.`)
    );
    await sleep(3000);
    await paymentVault.revertOwnership().then(() =>
        console.log(`Reverted ownership transaction done.`)
    );
}

function executeContracts(args: string[]) {
    let networkName = args[0];
    let tokenName = args[1];
    console.log(`Arguments passed: ${JSON.stringify(args)}`);

    doTransactions(networkName, tokenName).then(r => console.log("Done"));

}

executeContracts(args)
