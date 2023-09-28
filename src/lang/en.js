export const en = {
    language: "en",
    //global
    appName: "Dinnk",
    myOrders: "My Orders",
    greeting: "Hi, ",
    save: "Save",
    areYouSure: "Are You Sure?",
    consulteProfile: "Consulting Profile",
    erroSPK: "Error fetching public Token from server please try again later, or contact the admin",
    order: "Order",
    helloNotification: {
        title: "Hello !!",
        body: "Glad to See you, ",
    },
    carrierNotifMessage: {
        title: "You have a new Job",
        body: "A client asks for your services",
    },
    clientNotifMessage: {
        title: "Order served",
        body: "An order of yours has been delivered",
    },
    //Login Screen
    username: "Email",
    password: "Password",
    login: "Login",
    signup: "Sign-up",
    resetPass: "Reset Password",
    //signup:
    signUpSuccess: "",
    signUpSuccessTittle: "Your account has been created successfully, you'll be informed when it's validated by the admin",
    familyname: "Last Name",
    name: "First Name",
    corporateName: "Corporate Name",
    corporateNameSH: "C.N",
    role: "Merchant/Carrier",
    siren: "SIREN",
    siret: "SIRET",
    carrierType: "Type",
    confirmPassword: "Confirm Password",
    contry: "Contry",
    tel: "Phone number",
    sexe: "Sexe",
    //edituser
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",

    //splash Scrren
    slogan: "We deliver everything, for everyone and everywhere!",
    //profile
    profileScreenTitle: "Profile",
    ProfileLinks: {
        Share: 'Share the application',
        Help: "Help",
        About: "About Us",
        Settings: 'Your account\'s settings',
        EditUserInfo: 'Your informations',
    },
    logout: "Log Out",

    //Order screen
    orderScreenTitle: "Order",
    from: "From",
    to: "To",
    Comment: "Additional informations",
    orderBtn: "Creat Order",
    searchAddress: "Look for an address",

    //show Order Screen
    ShowOrderTitle: "Order",
    ValidatOrderTitle: "Validate Order",
    errorCoupon: "this coupon is invalid, please try another one",
    expiredCoupon: "You provided in expired Coupon",
    coupon: "Coupon code",
    useCoupon: "Use Coupon",
    endORderBtn: "End",
    payOrder: "Pay",
    validatOrder: "Validat",
    acceptOrder: "Accept",
    declineOrder: "Decline",
    //payment form
    payment: {
        emptyField: "All fields are required !!",
        error: "An error occurred",
        title: "Payment Gateway",
        cardHolder: "Card Holder",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        expiryDateBis: "00/00",
        CVC: "CVC",
        sub: "Pay",
    },


    //form validating
    formValidating: {
        required: "Required",
        maxLength: (max) => { return `Must be ${max} characters or less` },
        minLength: (min) => { return `Must be ${min} characters or more` },
        number: 'Must be a number',
        minValue: (min) => { return `Must be at least ${min}` },
        email: 'Invalid email address',
        tooYoung: 'You do not meet the minimum age requirement!',
        aol: 'Really? You still use AOL for your email?',
        alphaNumeric: 'Only alphanumeric characters',
        phoneNumber: 'Invalid phone number',
        password: "Password must contain at least 1 lowercase alphabetic character, 1 uppercase alphabetic character,1 numeric character, 1 special character !,@,#,$,%,&,* and  must be eight characters or longer",
        confirmPassword: "The password must match the confirmation",
        names: 'Only alphabet characters',
        dupEmail: "This email has been used by another user"
    },

    aboutText: "Last mile delivery experts.\n No matter what you sell, DINNK can deliver it in express and low cost.\nYou can count on dinnk to serve you.",
    helpText: "Questions, comments or special requests? Do not hesitate to contact us, we will be happy to help you."
}