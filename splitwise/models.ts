import { SplitType } from './types';

export interface IUser {
    id: number;
    name: string;
    email: string;
}

export interface IExpense {
    id: number;
    amount: number;
    description: string;
    userId: number;
    splitIds: number[];
    splitType: SplitType;
    splitNumber: number[];
    settledAt?: Date;
}

export interface ISplit {
    id: number;
    amount: number;
    userId: number;
    expenseId: number;
    settled: boolean;
}

export interface IBalance {
    userId: number;
    owedUserId: number;
    amount: number;
}