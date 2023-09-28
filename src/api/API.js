import wretch from 'wretch';
import { BASE_URL, LOGIN_LINK } from "../constants";

//export const userApi = wretch(`${BASE_URL}/api/utilisateurs`);
export const paimentApi = wretch(`${BASE_URL}/api/paiements`);
export const SPK = wretch(`${BASE_URL}/config/stripe/public`);
export const baseApi = wretch(`${BASE_URL}`);
export const loginApi = wretch(`${LOGIN_LINK}`);
//push Notifications

export const notify = wretch(`https://exp.host/--/api/v2/push`).headers({
    host: "exp.host",
    accept: "application/json",
    "accept-encoding": "gzip, deflate",
    "content-type": "application/json"
})