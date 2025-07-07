import { Transaction, TransactionType } from "../models/wallet";

export class WalletService {
    private balanceMap: Map<number, number>;
    private transactionMap: Map<number, Transaction[]>;
    private transactionCount: number;

    constructor() {
        this.balanceMap = new Map();
        this.transactionMap = new Map();
        this.transactionCount = 0;
    }

    createWallet(userId: number) {
        this.balanceMap.set(userId, 0);
        this.transactionMap.set(userId, []);
    }

    roundUpToTwo(amount: number): number {
        return parseFloat(amount.toFixed(2));
    }

    getBalance(userId: number): number | Error {
        const balance = this.balanceMap.get(userId);
        if (balance == undefined) throw new Error("No wallet found for the given user");
        return balance;
    }

    getTransactions(userId: number): Transaction[] {
        const transactions = this.transactionMap.get(userId);
        if (!transactions) throw new Error("No wallet found for the given user");

        return [...transactions].reverse();
    }

    deposit(amount: number, userId: number): void {

        let roundedAmount = this.roundUpToTwo(amount);

        const curBalance = this.balanceMap.get(userId) || 0;
        this.balanceMap.set(userId, curBalance + roundedAmount);

        const transaction: Transaction = {
            id: this.transactionCount++,
            type: TransactionType.DEPOSIT,
            amount: roundedAmount,
            date: new Date(),
            toUser: userId,
            fromUser: userId,
        }

        const transactions = this.transactionMap.get(userId);
        if (transactions) {
            transactions.push(transaction);
        } else {
            throw new Error("No wallet found for the given user");
        }
    }

    transferOut(amount: number, fromUserId: number, toUserId: number): Transaction | Error {
        // check if sufficient balance is present
        const balance = this.balanceMap.get(fromUserId);

        if (balance == undefined) {
            throw new Error("No wallet found for the given user");
        }

        const roundedAmount = this.roundUpToTwo(amount);
        if (balance < roundedAmount) {
            throw new Error("Insufficient balance");
        }

        const transaction: Transaction = {
            id: this.transactionCount++,
            type: TransactionType.TRANSFER_OUT,
            amount: roundedAmount,
            date: new Date(),
            toUser: toUserId,
            fromUser: fromUserId
        }

        // Update balance
        this.balanceMap.set(fromUserId, balance - roundedAmount);

        // Update transaction history
        const transactions = this.transactionMap.get(fromUserId);
        if (!transactions) {
            throw new Error("Error")
        }
        transactions.push(transaction);

        return transaction;
    }

    transferIn(amount: number, toUserId: number, fromUserId: number): Transaction | Error {
        // Check if wallet exists
        if (!this.balanceMap.has(toUserId)) {
            throw new Error("No wallet found for the given user");
        }

        const roundedAmount = this.roundUpToTwo(amount);

        const transaction: Transaction = {
            id: this.transactionCount++,
            type: TransactionType.TRANSFER_IN, // Fixed transaction type
            amount: roundedAmount,
            date: new Date(),
            toUser: toUserId,
            fromUser: fromUserId
        }

        // Update balance
        const currentBalance = this.balanceMap.get(toUserId) || 0;
        this.balanceMap.set(toUserId, currentBalance + roundedAmount);

        // Update transaction history
        const transactions = this.transactionMap.get(toUserId);
        if (!transactions) {
            throw new Error("No wallet found for the given user");
        }
        transactions.push(transaction);

        return transaction;
    }
}