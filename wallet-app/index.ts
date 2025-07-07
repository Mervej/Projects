import { UserService } from "./models/user";
import { WalletService } from "./services/wallter-service";

const userService = new UserService();
const user1 = userService.createUser("mervej", "raj");
const user2 = userService.createUser("mervej1", "raj1");

const walletService = new WalletService();

const wallte1 = walletService.createWallet(user1.id);
const wallte2 = walletService.createWallet(user2.id);

walletService.deposit(1000, user1.id);
walletService.transferOut(1000, user1.id, user2.id);
console.log(walletService.getBalance(user1.id));
console.log(walletService.getBalance(user2.id));