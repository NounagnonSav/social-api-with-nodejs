module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if (err.message.includes('email'))
        errors.email = "Email incorrect";

    if (err.message.includes('password'))
        errors.password = "Le mot de passe doit fait 6 caractères minimun";

    if (err.code === 11000 && err.message.includes('pseudo'))
        errors.email = "Pseudo est déjà enregistré";

    if (err.code === 11000 && err.message.includes('email'))
        errors.email = "Email est déjà enregistré";

    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.message.includes('email'))
        errors.email = "L'email est incorrect";

    if (err.message.includes('password'))
        errors.password = "Le mot de passe est incorrect";

    return errors;
}

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: '' };

    if (err.message.includes('invalid file'))
        errors.format = "format incompatible";
    
    if (err.message.includes('max size'))
        errors.maxSize = "Taille incompatible";

    return errors;
}