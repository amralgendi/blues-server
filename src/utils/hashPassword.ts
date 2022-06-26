import bcrypt from 'bcryptjs'

const createHashedPassword = async (password: string): Promise<string> =>
    await bcrypt.hash(password, 12)

const isValidPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => await bcrypt.compare(password, hashedPassword)

export { createHashedPassword, isValidPassword }
