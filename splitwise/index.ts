import { BalanceService } from "./services/balance-service";
import { UserService } from "./services/user-service";
import { ExpenseService } from "./services/expense-service"
import { SplitType } from "./types";

const balanceService = new BalanceService();
const expenseService = new ExpenseService(balanceService);
const userService = new UserService();

const user1 = userService.createUser("1", "1");
const user2 = userService.createUser("2", "2");
const user3 = userService.createUser("3", "3");

try {

    // create an expense 
    const expense1 = expenseService.createExpense(
        1000,
        "test_1",
        user2.id,
        [user1.id],
        SplitType.EXACT,
        [1000]
    )

    // create an expense 
    const expense2 = expenseService.createExpense(
        5000,
        "test_2",
        user3.id,
        [user2.id],
        SplitType.EQUAL,
        []
    )

    const expense3 = expenseService.createExpense(
        2000,
        "test_3",
        user1.id,
        [user3.id],
        SplitType.EQUAL,
        []
    )

    balanceService.simplifyDebt()
}
catch (err) {
    console.log(err);
}