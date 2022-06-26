import jwt from 'jsonwebtoken'
import IUser from '../interfaces/user'

interface encodedToken {
    id: string
    email: string
    verified: boolean
}

const generateToken = (user: IUser, expiry: undefined | string): string => {
    if (expiry)
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                verified: user.verified,
            } as encodedToken,
            process.env.SECRET_TOKEN as jwt.Secret,
            {
                expiresIn: expiry,
            }
        )
    else
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                verified: user.verified,
            } as encodedToken,
            process.env.SECRET_TOKEN as jwt.Secret
        )
}

export { generateToken }
