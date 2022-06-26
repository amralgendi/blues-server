import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users'
import todoRouter from './routes/todos'
import dotenv from 'dotenv'
import { sendTestMail } from './utils/sendMail'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/todos', todoRouter)
app.get('/', (req, res) => {
    res.send('Hello')
})
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mn6f7.mongodb.net/blues?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('DB connected')
        sendTestMail().then(() => {
            console.log('Email Sender works!')
            app.listen(process.env.PORT || 5000, () => {
                console.log('Connected')
            })
        })
    })

    .catch((e) => {
        console.log(e)
    })
