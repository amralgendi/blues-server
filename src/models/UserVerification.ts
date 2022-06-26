import { Model, model, Schema } from 'mongoose'
import IUserVerification from '../interfaces/userVerification'
import { sendVerificationCode } from '../utils/sendMail'

const userVerificationSchema = new Schema({
    code: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

userVerificationSchema.pre('save', async function (next) {
    await this.populate('user')
    const { user } = this as IUserVerification
    await UserVerification.findOneAndDelete({ email: user.email })

    await sendVerificationCode(user.email, (this as IUserVerification).code)
    next()
})

userVerificationSchema.post(
    'save',
    async (verificationCode: IUserVerification) => {
        setTimeout(async () => {
            await UserVerification.findByIdAndDelete(verificationCode.id)
            console.log('deleted')
        }, 180000)
    }
)

const UserVerification: Model<IUserVerification> = model<IUserVerification>(
    'UserVerification',
    userVerificationSchema
)

export default UserVerification
