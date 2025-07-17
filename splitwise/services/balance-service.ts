import { IBalance, IExpense, ISplit } from "../models";
import { roundUp } from "../types";

export class BalanceService {
    balances: Map<string, IBalance> = new Map();
    simpleBalance: Map<string, IBalance> = new Map();

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


    /**
        * Simplifies the debts between users by consolidating balances.
        * @example
        * balanceService.simplifyDebt()
        * This alters the balances map by consolidating individual balances.
        * @returns {void} Does not return anything.
        * @description
        *   - Iterates through all balances and computes net amounts owed or receivable by each user.
        *   - Updates the balances map by considering offsets between users rather than displaying separate transactions.
    */
    simplifyDebt(): void {
        let individualBalance: Map<number, number> = new Map();

        // calculate the individual balances for each member
        for (let balance of this.balances.values()) {
            individualBalance.set(balance.owedUserId, (individualBalance.get(balance.owedUserId) || 0) - balance.amount);
            individualBalance.set(balance.userId, (individualBalance.get(balance.userId) || 0) + balance.amount);
        }

        // convert to array for easier processing
        let netBalances: Array<{ userId: number, amount: number }> = [];
        for (let [userId, amount] of individualBalance.entries()) {
            if (amount != 0) {
                netBalances.push({ userId, amount })
            }
        }

        // greedily settles debts 
        while (netBalances.length > 1) {
            let maxCreditor = 0, minCreditor = 0;

            for (let i = 1; i < netBalances.length; i++) {
                if (netBalances[i].amount > netBalances[maxCreditor].amount) maxCreditor = i
                if (netBalances[i].amount < netBalances[minCreditor].amount) minCreditor = i
            }

            let creditor = netBalances[maxCreditor];
            let debtor = netBalances[minCreditor];
            let settleAmount = Math.min(creditor.amount, -debtor.amount);

            creditor.amount -= settleAmount;
            debtor.amount += settleAmount;

            const balanceKey = this.getBalanceKey(creditor.userId, debtor.userId);
            this.simpleBalance.set(balanceKey, {
                userId: creditor.userId,
                owedUserId: debtor.userId,
                amount: settleAmount
            })

            // remove higher indexes first
            let indexs: number[] = [];
            if (creditor.amount == 0) indexs.push(maxCreditor);
            if (debtor.amount == 0) indexs.push(minCreditor);
            indexs.sort((a, b) => b - a)

            for (const id of indexs) {
                netBalances.splice(id, 1)
            }
        }

        console.log(this.simpleBalance)
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

    printBalanceList(): void {
        console.log(this.balances);
    }


    // 0 owes 1 $1000
    // 1 owes 2 $5000
    // 2 owes 0 $2000

    // 0: +1000
    // 1: -4000
    // 2: +3000

    // 0 owes 1 $1000
    // 1 owes 2 $5000
    // 2 owes 0 $2000

}