import jwt from 'jsonwebtoken'
import IUser from '../interfaces/user'

interface encodedToken {
    id: string
    email: string
    verified: boolean
}

const generateToken = (user: IUser): string => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            verified: user.verified,
        } as encodedToken,
        process.env.SECRET_TOKEN as jwt.Secret,
        {
            expiresIn: '1h',
        }
    )
    return token
}

export { generateToken }
