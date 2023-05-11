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

    private networkName: string;


    constructor(networkName: string, tokenName: string) {
        this.tokenContractAddress = Constant.contractAddress[networkName][tokenName];
        this.networkRPCURL = Constant.contractAddress[networkName]["rpcURL"];
        this.paymentContract = Constant.contractAddress[networkName]["paymentVault"];
        this.userWalletAddress = Constant.contractAddress[networkName]["userAddress"];
        this.userPrivateKey = Constant.contractAddress[networkName]["userPrivateKey"];
        this.deployerWalletAddress = Constant.contractAddress[networkName]["deployerAddress"];
        this.deployerPrivateKey = Constant.contractAddress[networkName]["deployerPrivateKey"];
        this.newWalletPrivateKey = Constant.contractAddress[networkName]["newWalletPrivateKey"];
        this.networkName = networkName;

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

    private async _checkProposedOwnerUpdate(): Promise<string> {
        const oThis = this;
        let proposedOwnerOfAccount: string = "";
        let tokenInstance = new this.web3.eth.Contract(contractABI.abi as any, oThis.paymentContract);
        tokenInstance.methods.pendingOwner()
            .call(function (err: any, res: any) {
                if (err) {
                    console.log("An error occurred", err)
                    return 0;
                }
                console.log("The proposed owner is: ", res);
                proposedOwnerOfAccount = res;
            })
        return proposedOwnerOfAccount;
    }

    private async _checkOwnerUpdate(): Promise<string> {
        const oThis = this;
        let ownerOfAccount: string = "";
        let tokenInstance = new this.web3.eth.Contract(contractABI.abi as any, oThis.paymentContract);
        tokenInstance.methods.Owner()
            .call(function (err: any, res: any) {
                if (err) {
                    console.log("An error occurred", err)
                    return 0;
                }
                console.log("The owner is: ", res);
                ownerOfAccount = res;
            })
        return ownerOfAccount;
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
        const txReceiptTopics = await this.waitForTransactionStatus(txHash, "DEPOSIT");

        await sleep(3000);
        this.verifyEventParams(txReceiptTopics, oThis.tokenContractAddress, oThis.userWalletAddress, amount, "DEPOSIT");
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
        const txReceiptTopics = await this.waitForTransactionStatus(txHash, "WITHDRAW");

        await sleep(3000);
        this.verifyEventParams(txReceiptTopics, oThis.tokenContractAddress, oThis.deployerWalletAddress, amount,"WITHDRAW");
        let balanceOfAccountAfter = await oThis._checkTokenBalance(oThis.deployerWalletAddress);
        let diffNumber = new BigNumber(balanceOfAccountAfter.toString()).minus(balanceOfAccountBefore.toString());
        assert(diffNumber.isEqualTo(amount.toString()), `Total balance of owner is not as expected`);
    }

    public async proposeOwnership(newOwnerAddress: string, privateKey: string) {
        const oThis = this;
        console.log("\n ======================= Propose ownership =======================");
        let depositCallEncoded = this.paymentInstance.methods.proposeOwnership(newOwnerAddress).encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, privateKey, oThis.paymentContract, "PROPOSE_OWNERSHIP");
        await this.waitForTransactionStatus(txHash, "TRANSFER_OWNERSHIP");
        let updatedOwner = await oThis._checkProposedOwnerUpdate();
        assert(updatedOwner != newOwnerAddress, `Ownership not transferred as expected.`);
    }

    public async acceptOwnership(newOwnerAddress: string, privateKey: string) {
        const oThis = this;
        console.log("\n ======================= Starting transfer ownership funds transaction =======================");
        let depositCallEncoded = this.paymentInstance.methods.acceptOwnership().encodeABI();
        const txHash = await this.sendTransaction(depositCallEncoded, privateKey, oThis.paymentContract, "TRANSFER_OWNERSHIP");
        await this.waitForTransactionStatus(txHash, "TRANSFER_OWNERSHIP");
        let updatedOwner = await oThis._checkOwnerUpdate();
        assert(updatedOwner != newOwnerAddress, `Ownership not transferred as expected.`);
    }

    private async sendTransaction(txDataEncoded: any, privateKey: string, toContract: string, operation: string) {
        let block = await this.web3.eth.getBlock('latest');
        const gasLimit = Math.round(block.gasUsed / block.transactions.length);
        const gasPrice = await this.web3.eth.getGasPrice();

        const transactionParameters = {
            gas: this.networkName === 'goerliArbitrum' ? Constant.defaultGasLimit: gasLimit,
            gasPrice: gasPrice,
            to: toContract,
            data: txDataEncoded
        };

        try {
            const signedTx = await this.web3.eth.accounts.signTransaction(transactionParameters, privateKey);
            console.log(`${operation}: Signed transaction details: ${JSON.stringify(signedTx)}`);
            this.web3.eth.sendSignedTransaction(signedTx.rawTransaction,
                function (error: Error, hash: string)
                {
                    console.log(`Callback function error check: ${error}`);
                    return "";
                }).on( 'error' , function( error: any ) {
                    console.error( error.message );
                    return "";
                });
            return signedTx.transactionHash;
        } catch (error) {
            console.log(`${operation} Error: ${error}`);
        }
    }


    private async waitForTransactionStatus(txHash: string, operation: string) {
        if (txHash === ""){
            console.log(`Error in transaction`);
            process.exit(1);
        }
        let breakCount = 20;
        while (breakCount) {
            const txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
            if (txReceipt !== null && txReceipt.status) {
                if (txReceipt.logs.length === 0){
                    return;
                }
                console.log(`${operation} receipt: `, JSON.stringify(txReceipt));
                let index = ["DEPOSIT", "WITHDRAW"].includes(operation) ? 2 : 0;
                if (operation === "WITHDRAW"){
                    index = 1;
                }
                let receiptLogData = txReceipt.logs[index].data;
                console.log(`Data value ${this.decodeData(receiptLogData)}`);
                console.log(`${operation} receipt topic: `, JSON.stringify(txReceipt.logs[index].topics));
                return {
                    topics: txReceipt.logs[index].topics,
                    data: txReceipt.logs[index].data
                };
            } else {
                console.log(`Waiting for ${operation} transaction receipt`);
                await sleep(2000);
            }
            breakCount--;
            console.log(`Break after ${breakCount} iterations`)
        }
    }

    private verifyEventParams(logDetails: any, firstEventParams: string, secondEventParams: string, valueData:bigint, operation: string){
        assert(this.web3.utils.hexToNumberString(logDetails.topics[1]) === this.web3.utils.hexToNumberString(firstEventParams), `${operation} first params doesn't match.`);
        assert(this.web3.utils.hexToNumberString(logDetails.topics[2]) === this.web3.utils.hexToNumberString(secondEventParams), `${operation} second params doesn't match..`);
        assert(this.web3.utils.hexToNumberString(logDetails.data) === valueData.toString(), `${operation} data doesn't match..`);
    }

    private decodeData(receiptLogData: string){
        const stringValue = this.web3.utils.hexToNumberString(receiptLogData);
        console.log(`Hex ${receiptLogData} \nString ${stringValue}`);
        return stringValue;
    }
}

async function doTransactions(networkName: string, tokenName: string) {
    const paymentVault = new PaymentWrapper(networkName, tokenName);
    // Fund transfer test case
    await testFundTransfer(paymentVault, networkName, tokenName);

    // Ownership test case
    await transferOwnershipTest(paymentVault, networkName, tokenName);

    // Revert ownership test case
    await revertOwnershipTest(paymentVault, networkName, tokenName);
}

async function testFundTransfer(paymentVault: PaymentWrapper, networkName: string, tokenName: string) {
    await paymentVault.approveFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Approve transaction done. Approved funds to ${Constant.contractAddress[networkName]["paymentVault"]}`)
    );
    await sleep(1000);
    await paymentVault.depositFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Deposit transaction done. Deposited funds to ${Constant.contractAddress[networkName]["paymentVault"]}`)
    );
    await sleep(1000);
    await paymentVault.withdrawFunds(Constant.transferAmountInGWEI).then(() =>
        console.log(`Withdraw transaction done. Withdrawn funds to ${Constant.contractAddress[networkName]["deployerAddress"]}`)
    );
}

async function transferOwnershipTest(paymentVault: PaymentWrapper, networkName: string, tokenName: string) {
    await sleep(1000);
    await paymentVault.proposeOwnership(process.env.NEW_OWNER_WALLET_ADDRESS!,
        Constant.contractAddress[networkName]["deployerPrivateKey"]).then(() =>
        console.log(`Transfer ownership transaction done.`)
    );
    await sleep(1000);
    await paymentVault.acceptOwnership(process.env.NEW_OWNER_WALLET_ADDRESS!,
        Constant.contractAddress[networkName]["newWalletPrivateKey"]).then(() =>
        console.log(`Transfer ownership transaction done.`)
    );
}

async function revertOwnershipTest(paymentVault: PaymentWrapper, networkName: string, tokenName: string) {
    await sleep(3000);
    await paymentVault.proposeOwnership(process.env.DEPLOYER_WALLET_ADDRESS!,
        Constant.contractAddress[networkName]["newWalletPrivateKey"]).then(() =>
        console.log(`Transfer ownership transaction done.`)
    );
    await sleep(1000);
    await paymentVault.acceptOwnership(process.env.DEPLOYER_WALLET_ADDRESS!,
        Constant.contractAddress[networkName]["deployerPrivateKey"]).then(() =>
        console.log(`Transfer ownership transaction done.`)
    );
}

function executeContracts(args: string[]) {
    let networkName = args[0];
    let tokenName = args[1];
    console.log(`Arguments passed: ${JSON.stringify(args)}`);

    doTransactions(networkName, tokenName).then(r => console.log("Done"));

}

executeContracts(args)
