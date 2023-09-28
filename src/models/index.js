import { CurrentUser as user } from "./CurrentUser";
import { GlobalData as data } from "./GlobalData"; 

const CurrentUser = user.create();
const GlobalData = data.create(); 

export const store = {
    CurrentUser,
    GlobalData
}