
import {strings} from "../lang" ; 
const {formValidating} = strings;
export const required = value => (value || typeof value === 'number'
    ? undefined
    : formValidating.required);
export const maxLength = max => value =>
    value && value.length > max
        ? formValidating.maxLength(max)
        : undefined;
export const minLength = min => value =>
    value && value.length < min
        ? formValidating.minLength(min)
        : undefined;
export const number = value =>
    value && isNaN(Number(value)) ? formValidating.number : undefined
export const minValue = min => value =>
    value && value < min
        ? formValidating.minValue
        : undefined;
export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? formValidating.email
        : undefined;
export const tooYoung = value =>
    value && value < 13
        ? formValidating.tooYoung
        : undefined;
export const aol = value =>
    value && /.+@aol\.com/.test(value)
        ? formValidating.aol
        : undefined;
export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? formValidating.alphaNumeric
        : undefined;
export const phoneNumber = value =>
    value && !(new RegExp("^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$" 
    + "|^(\\+\\d{1,3}( )?)?(\\d{3}[ ]?){2}\\d{3}$" 
    + "|^(\\+\\d{1,3}( )?)?(\\d{3}[ ]?)(\\d{2}[ ]?){2}\\d{2}$")).test(value)
        ? formValidating.phoneNumber
        : undefined;
export const password = value =>
    value && !(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).test(value)
        ? formValidating.password
        : undefined;
export const confirmPassword = (confir, pass) =>
    confir !== pass
        ? formValidating.confirmPassword
        :undefined;
export const names = value =>
    value && /[^a-zA-Z ]/i.test(value)
        ? formValidating.names
        : undefined;