import IUser from '../interfaces/user'
import UserVerification from '../models/UserVerification'
import randomCodeGenerator from '../utils/randomCode'

const createEmailVerificationCode = async (user: IUser): Promise<void> => {
    const code = new UserVerification({
        user: user.id,
        code: randomCodeGenerator(),
    })

    await code.save()
}

export { createEmailVerificationCode }
