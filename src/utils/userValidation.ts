interface resetPasswordValidationError {
    password?: string
    confirmPassword?: string
}
interface signinValidationError {
    email?: string
    password?: string
}
interface registrationValidationError extends signinValidationError {
    confirmPassword?: string
}

const validateRegistration = (
    email: string,
    password: string,
    confirmPassword: string
): { valid: boolean; errors: registrationValidationError } => {
    const errors: registrationValidationError = {}
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
        errors.email = 'Must be a valid Email'
    if (password == '') errors.password = 'Password Required'
    else if (password.length < 8)
        errors.password = 'Password length must exceed eight characters'
    if (confirmPassword != password)
        errors.confirmPassword = "Passwords don't match"

    return { valid: Object.keys(errors).length < 1, errors }
}

const validateSignin = (
    email: string,
    password: string
): { valid: boolean; errors: signinValidationError } => {
    const errors: signinValidationError = {}

    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
        errors.email = 'Must be a valid Email'
    if (password == '') errors.password = 'Password Required'
    else if (password.length < 8)
        errors.password = 'Password length must exceed eight characters'

    return { valid: Object.keys(errors).length < 1, errors }
}

const validatePasswordReset = (password: string, confirmPassword: string) => {
    console.log(password, confirmPassword)

    const errors: resetPasswordValidationError = {}
    if (!password) errors.password = 'Password Required'
    else if (password.length < 8)
        errors.password = 'Password length must exceed eight characters'
    if (confirmPassword !== password)
        errors.confirmPassword = "Passwords don't match"
    return { valid: Object.keys(errors).length < 1, errors }
}
export { validateRegistration, validateSignin, validatePasswordReset }
