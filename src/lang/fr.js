export const fr = {
    language: "fr",
    //global
    appName: "Dinnk",
    myOrders: "Mes Courses",
    greeting: "Salut, ",
    save: "Enregistrer",
    areYouSure: "Êtes-vous sûr?",
    consulteProfile: "Consultation du profil",
    erroSPK: "Erreur lors de la récupération du jeton public du serveur, veuillez réessayer plus tard ou contacter l'administrateur",
    order: "Nouvelle course",
    title: "Nouvelle course",
    body: "vous venez d'être assigné une nouvelle course ",
    helloNotification: {
        title: "Salut !!",
        body: "Heureux de vous voir,",
    },
    carrierNotifMessage: {
        title: "Nouvelle course",
        body: "vous venez d'être assigné une nouvelle course ",
    },
    clientNotifMessage: {
        title: "Commande servie",
        body: "Une de vos commandes a été livrée",
    },
    //Login Screen
    username: "Email",
    password: "Mot de passe",
    login: "S'identifier",
    signup: "S'inscrire",
    resetPass: "réinitialiser le mot de passe",
    //signup:
    signUpSuccess: "",
    signUpSuccessTittle: "Votre compte a été créé avec succès, vous serez informé lorsqu'il sera validé par l'administrateur",
    familyname: "Nom",
    name: "Prénom",
    corporateName: "Nom de commerce",
    corporateNameSH: "N.C",
    role: "Commerçant/livreur",
    siren: "SIREN",
    siret: "SIRET",
    carrierType: "Type",
    confirmPassword: "Confirmez le MDP",
    contry: "Pays",
    tel: "Numéro de téléphone",
    sexe: "Sexe",
    //edituser
    oldPassword: "Ancien mot de passe",
    newPassword: "Nouveau mot de passe",
    confirmNewPassword: "Confirmez le nouveau MDP",

    //splash Scrren
    slogan: "On livre tout, pour tous et partout !",//TODO: app slog
    //profile
    profileScreenTitle: "Profil",
    ProfileLinks: {
        Share: 'Partager l\'application',
        Help: "Besoin d'aide?",
        About: "À propos de nous",
        Settings: 'Paramètres',
        EditUserInfo: 'Mes informations',
    },
    logout: "Se déconnecter",

    //Order screen
    orderScreenTitle: "Nouvelle course",
    from: "Origine",
    to: "Déstination",
    Comment: "Commentaire",
    orderBtn: "Créer",
    searchAddress: "Cherchez une adresse",

    //show Order Screen
    ShowOrderTitle: "Course",
    ValidatOrderTitle: "Valider la course",
    errorCoupon: "ce coupon n'est pas valide, veuillez en essayer un autre",
    expiredCoupon: "Le coupon que vous avez utiliser est éxpiré",
    coupon: "Code de coupon",
    useCoupon: "Utiliser un coupon",
    endORderBtn: "Finaliser la course",
    payOrder: "Payer",
    validatOrder: "Valider",
    acceptOrder: "Accepter",
    declineOrder: "Refuser",
    //payment form
    payment: {
        emptyField: "Tous les champs sont requis !!",
        error: "Une erreur s'est produite",
        title: "Passerelle de paiement",
        cardHolder: "Titulaire de la carte",
        cardNumber: "Numéro de carte",
        expiryDate: "Date d'expiration",
        expiryDateBis: "00/00",
        CVC: "CVC",
        sub: "Pyer",
    },


    //form validating
    formValidating: {
        required: "Obligatoire",
        maxLength: (max) => { return `Doit avoir ${max} caractères ou moins` },
        minLength: (min) => { return `Doit avoir ${min} caractères ou plus` },
        number: 'Doit être numérique',
        minValue: (min) => { return `Must be at least ${min}` },
        email: 'Adresse mail invalide',
        tooYoung: `Vous ne remplissez pas l'âge minimum requis!`,
        aol: 'Really? You still use AOL for your email?',
        alphaNumeric: 'Seulement les caractères alphanumériques',
        phoneNumber: 'Numéro de téléphone invalide',
        password: "Le mot de passe doit contenir au moins 1 caractère alphabétique minuscule, 1 caractère alphabétique majuscule, 1 caractère numérique, 1 caractère spécial!, @, #, $,%, &, * Et doit comporter au moins huit caractères",
        confirmPassword: "Le mot de passe doit correspondre à la confirmation",
        names: `Seuls les caractères de l'alphabet`,
        dupEmail: "Un autre utilisateur utilise cette adresse"
    },


    aboutText: "Experts de la livraison du derniers kilomètres.\n Peu importe ce que vous vendez, DINNK peut le livré en express et à bas coût.\nVous pouvez compter sur dinnk pour vous servir.",
    helpText: "Des questions, des commentaires ou des demandes particulières ? N'hésitez pas à nous contacter, nous serons ravis de vous aider."
}