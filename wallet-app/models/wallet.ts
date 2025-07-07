export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT"
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    date: Date;
    toUser: number;
    fromUser: number;
}

export interface IWallet {
    userId: number;
    getBalance(): number;
    getTransactions(): Transaction[];
    deposit(amount: number, transactionId: number): void;
    transferOut(amount: number, toUser: number): Transaction | Error;
    transferIn(amount: number, fromUser: number): Transaction | Error;
}