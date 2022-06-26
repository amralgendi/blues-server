import nodemailer from 'nodemailer'

interface messageOptionsInput {
    to: string
    subject: string
    text: string
}
interface fullMessageOptions extends messageOptionsInput {
    from: string
}

const sendMail = async (options: messageOptionsInput): Promise<void> => {
    const client = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    const messageOptions: fullMessageOptions = {
        from: process.env.EMAIL as string,
        ...options,
    }

    try {
        await client.sendMail(messageOptions)
    } catch (error) {
        let message = 'Error with NodeMailer'
        if (error instanceof Error) message = error.message

        throw new Error(message)
    }
}

const sendVerificationCode = async (
    email: string,
    code: string
): Promise<void> => {
    await sendMail({
        to: email,
        subject: 'Email Verification',
        text: 'Your email verification code is ' + code,
    })
}

const sendTestMail = async () => {
    const msgOptions: messageOptionsInput = {
        to: process.env.EMAIL as string,
        subject: 'test',
        text: 'This is a test email',
    }
    try {
        await sendMail(msgOptions)
    } catch (error) {
        let message = 'Error with NodeMailer'
        if (error instanceof Error) message = error.message

        throw new Error(message)
    }
}
const sendPasswordResetLink = async (email: string, url: string) => {
    const msgOptions: messageOptionsInput = {
        to: email,
        subject: 'Password Reset',
        text: 'Your password reset link is ' + url,
    }
    try {
        await sendMail(msgOptions)
    } catch (error) {
        let message = 'Error with NodeMailer'
        if (error instanceof Error) message = error.message

        throw new Error(message)
    }
}

export { sendVerificationCode, sendTestMail, sendPasswordResetLink }
