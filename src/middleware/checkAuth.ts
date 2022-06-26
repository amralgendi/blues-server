import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authentication } = req.headers

    if (!authentication)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Authentication required',
            },
        })
    const token = (authentication as string).split('Bearer ')[1]
    if (!token)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Bad Authentication',
            },
        })
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.SECRET_TOKEN as string
        )
        res.locals['user'] = decodedToken
        next()
    } catch (err) {
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Not Logged in!',
            },
        })
    }
}
const checkVerified = (req: Request, res: Response, next: NextFunction) => {
    const { verified } = res.locals['user']
    if (!verified)
        return res.status(400).json({
            success: false,
            errors: {
                verified: 'User not Verified',
            },
        })
    next()
}
export { checkAuth, checkVerified }
