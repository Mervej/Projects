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
        150,
        "test_1",
        user1.id,
        [user1.id, user2.id, user3.id],
        SplitType.EXACT,
        [50, 50, 50]
    )

    // create an expense 
    const expense2 = expenseService.createExpense(
        300,
        "test_2",
        user2.id,
        [user1.id, user2.id, user3.id],
        SplitType.EQUAL,
        []
    )

    console.log(balanceService.getUserBalances(user1.id))
    console.log(balanceService.getUserBalances(user2.id))
    console.log(balanceService.getUserBalances(user3.id))
}
catch (err) {
    console.log(err);
}