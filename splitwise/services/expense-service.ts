import { IExpense, ISplit } from "../models";
import { SplitType, roundUp } from "../types";
import { BalanceService } from "./balance-service";

export class ExpenseService {
    private expenses: Map<number, IExpense> = new Map();
    private splits: Map<number, ISplit> = new Map();
    private count: number = 0;
    private splitCount: number = 0;
    private balanceService: BalanceService;

    constructor(balanceService: BalanceService) {
        this.balanceService = balanceService;
    }

    createExpense(amount: number, description: string, userId: number, splitIds: number[], splitType: SplitType, splitAmounts: number[]): IExpense | Error {
        const id = this.count++;
        const splitModelIds: number[] = [];
        amount = roundUp(amount);

        switch (splitType) {
            case SplitType.EQUAL:
                const equalShare = roundUp(amount / splitIds.length);

                let totalSplitAmount = 0;
                for (let i = 0; i < splitIds.length; i++) {
                    const splitUserId = splitIds[i];

                    let splitAmount = equalShare;

                    if (i == splitIds.length - 1)
                        splitAmount = roundUp(amount - totalSplitAmount);

                    totalSplitAmount += splitAmount;

                    if (splitUserId == userId) continue;

                    const split: ISplit = {
                        id: this.splitCount++,
                        amount: splitAmount,
                        userId: splitUserId,
                        expenseId: id,
                        settled: true
                    }

                    this.splits.set(split.id, split);
                    splitModelIds.push(split.id);
                }
                break;

            case SplitType.EXACT:

                // check if the split given is proper
                if (!splitAmounts || splitAmounts.length != splitIds.length)
                    return new Error("split amount and ids dont match");

                // check if rounded amount is equal to the total amount
                const roundedAmounts = splitAmounts.map(amount => roundUp(amount));
                const totalSum = splitAmounts.reduce((sum, amt) => roundUp(sum + amt), 0);

                if (totalSum != amount) return new Error("split amount and total amount dont match");

                for (let i = 0; i < splitIds.length; i++) {
                    const splitUserId = splitIds[i];

                    if (splitUserId == userId) continue;

                    const split: ISplit = {
                        id: this.splitCount++,
                        amount: roundedAmounts[i],
                        userId: splitUserId,
                        expenseId: id,
                        settled: false
                    }

                    this.splits.set(split.id, split);
                    splitModelIds.push(split.id);
                }
                break;

            case SplitType.PERCENTAGE:
                if (!splitAmounts || splitAmounts.length != splitIds.length)
                    return new Error("split precentage and ids dont match")

                // check if the split precentage is not equal to 100
                let totalPrecetage = splitAmounts.reduce((sum, amt) => sum + amount, 0)
                if (totalPrecetage != 100)
                    return new Error("Total precentage should be equal to 100")

                let totalPrecAmount = 0;
                for (let i = 0; i < splitIds.length; i++) {
                    let splitAmount = roundUp((amount * splitAmounts[i]) / 100)
                    const splitUserId = splitIds[i];

                    if (i == splitIds.length - 1) {
                        splitAmount = roundUp(amount - totalPrecAmount);
                    }

                    totalPrecAmount = roundUp(totalPrecAmount + splitAmount);

                    if (splitUserId == userId) continue;
                    const split: ISplit = {
                        id: this.splitCount++,
                        amount: splitAmount,
                        userId: splitUserId,
                        expenseId: id,
                        settled: false
                    }

                    this.splits.set(split.id, split);
                    splitModelIds.push(split.id);
                }
                break;

            default:
                return new Error("Invalid split type");
        }

        // create the expemse now 
        const expense: IExpense = {
            id,
            amount: roundUp(amount),
            description,
            userId,
            splitIds: splitModelIds,
            splitType,
            splitNumber: splitAmounts
        }

        // update the balances for each split 
        for (let splitId of splitModelIds) {
            const split = this.splits.get(splitId);
            if (split)
                this.balanceService.calculateBalance(split, expense);
        }

        this.expenses.set(id, expense);
        return expense
    }
}