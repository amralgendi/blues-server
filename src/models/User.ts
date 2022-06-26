import { model, Schema, Model } from 'mongoose'
import IUser from '../interfaces/user'
import { createEmailVerificationCode } from '../controllers/userVerification'

const userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
        required: true,
    },
    verified: { type: Boolean, default: false, required: true },
})

userSchema.post('save', (user: IUser) => {
    createEmailVerificationCode(user)
})

const User: Model<IUser> = model<IUser>('User', userSchema)
export default User
