import { IBalance, IExpense, ISplit } from "../models";
import { roundUp } from "../types";

export class BalanceService {

    balances: Map<string, IBalance> = new Map();

    private getBalanceKey(userId1: number, userId2: number) {
        return userId1 < userId2 ? `${userId1}:${userId2}` : `${userId2}:${userId1}`;
    }

    calculateBalance(split: ISplit, expense: IExpense): void {

        // Skip if user is same as split user
        if (split.userId == expense.userId) return;

        const balanceKey = this.getBalanceKey(split.userId, expense.userId);
        let balance = this.balances.get(balanceKey);

        if (!balance) {
            // if no previous balance is there just create the balance and set the same
            balance = {
                userId: expense.userId,
                owedUserId: split.userId,
                amount: roundUp(split.amount)
            }
            this.balances.set(balanceKey, balance)
        } else {
            // check the debitor already owes money
            if (balance.userId == expense.userId)
                balance.amount = roundUp(balance.amount + split.amount);
            else {
                // the creditor owes money
                if (balance.amount > split.amount)
                    balance.amount = roundUp(balance.amount - split.amount);
                else if (balance.amount < split.amount) {
                    balance.owedUserId = split.userId;
                    balance.userId = expense.userId;
                    balance.amount = roundUp(split.amount - balance.amount)
                } else
                    this.balances.delete(balanceKey);
            }
        }
    }

    getUserBalances(userId: number): IBalance[] {
        return Array.from(this.balances.values())
            .filter(balance => balance.userId == userId || balance.owedUserId == userId)
            .map(balance => {
                if (balance.userId == userId)
                    return { ...balance }
                else {
                    return {
                        userId: balance.owedUserId,
                        owedUserId: balance.userId,
                        amount: -balance.amount
                    }
                }
            })
    }
}