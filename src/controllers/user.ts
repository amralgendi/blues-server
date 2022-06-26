import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import IUser from '../interfaces/user'
import User from '../models/User'
import UserVerification from '../models/UserVerification'
import IUserVerification from '../interfaces/userVerification'
import { createHashedPassword, isValidPassword } from '../utils/hashPassword'
import { generateToken } from '../utils/jwt'
import {
    validatePasswordReset,
    validateRegistration,
    validateSignin,
} from '../utils/userValidation'
import { createEmailVerificationCode } from './userVerification'
import { sendPasswordResetLink } from '../utils/sendMail'
const registerController = async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body
    const { valid, errors } = validateRegistration(
        email,
        password,
        confirmPassword
    )
    if (!valid) return res.status(400).json({ success: false, errors })
    const existingUser = await User.findOne({ email })
    if (existingUser)
        return res.status(400).json({
            success: false,
            errors: {
                email: 'Email already exists',
            },
        })
    const hashedPassword = await createHashedPassword(password)
    const newUser = new User({ email, password: hashedPassword })
    const result = await newUser.save()
    const token = generateToken(result)

    res.status(200).json({
        success: true,
        data: {
            id: result.id,
            email: result.email,
            verified: result.verified,
            token,
        },
    })
}

const signinController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const { valid, errors } = validateSignin(email, password)
    if (!valid) return res.status(400).json({ success: false, errors })
    const user = (await User.findOne({ email })) as IUser

    if (!user)
        res.status(400).json({
            success: false,
            errors: { email: 'Email does not exists' },
        })
    const validPassword = await isValidPassword(password, user.password)

    if (!validPassword)
        return res.status(400).json({
            success: false,
            errors: {
                password: 'Invalid Password',
            },
        })
    const token = generateToken(user)
    res.status(200).json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            verified: user.verified,
            token,
        },
    })
}

const verifyCodeController = async (req: Request, res: Response) => {
    const { code } = req.query
    if (!code)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'No Code Provided',
            },
        })
    const { id } = res.locals['user']
    const userVerification = (await UserVerification.findOne({
        user: id,
    })) as IUserVerification
    if (!userVerification)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Verification code does not exist for this user',
            },
        })
    if (userVerification.code !== code)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Code invalid or expired',
            },
        })
    const user = (await User.findByIdAndUpdate(
        id,
        { verified: true },
        { new: true }
    )) as IUser
    const token = generateToken(user)

    await UserVerification.findByIdAndDelete(userVerification.id)
    return res.status(200).json({
        sucess: true,
        message: 'User Verified',
        data: {
            id: user.id,
            email: user.email,
            verified: user.verified,
            token,
        },
    })
}

const sendCodeController = async (req: Request, res: Response) => {
    const { id } = res.locals['user']
    const user = (await User.findById(id)) as IUser
    await createEmailVerificationCode(user)
    return res.json({
        success: true,
        message: 'Code sent Successfully',
    })
}
const forgotPasswordController = async (req: Request, res: Response) => {
    const { email } = req.body
    const user = (await User.findOne({ email })) as IUser
    if (!user)
        return res.status(400).json({
            success: false,
            errors: {
                email: 'Email does not exist',
            },
        })
    const token = generateToken(user)
    const url = `${process.env.CLIENT_HOST}/reset-password/${user.id}/${token}`
    await sendPasswordResetLink(user.email, url)
    return res.status(200).json({
        success: true,
        message: 'Link sent to your email',
    })
}
const resetPasswordController = async (req: Request, res: Response) => {
    const { id, token } = req.params
    const { password, confirmPassword } = req.body
    const { valid, errors } = validatePasswordReset(password, confirmPassword)
    if (!valid) return res.status(400).json({ success: false, errors })
    try {
        jwt.verify(token, process.env.SECRET_TOKEN as string)
        const user = (await User.findById(id)) as IUser
        if (!user)
            return res.status(400).json({
                success: false,
                errors: { general: 'Invalid or Expired Token' },
            })
        const hashedPassword = await createHashedPassword(password)
        user.password = hashedPassword
        await user.save()
        return res
            .status(200)
            .json({ success: true, message: 'Password reset successfully' })
    } catch (error) {
        return res.status(400).json({
            success: false,
            errors: { general: 'Invalid or Expired Token' },
        })
    }
}
export {
    registerController,
    signinController,
    verifyCodeController,
    sendCodeController,
    forgotPasswordController,
    resetPasswordController,
}
