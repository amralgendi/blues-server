import express from 'express'
import {
    forgotPasswordController,
    registerController,
    resetPasswordController,
    sendCodeController,
    signinController,
    verifyCodeController,
} from '../controllers/user'
import { checkAuth } from '../middleware/checkAuth'
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Users')
})

router.post('/signin', signinController)
router.post('/register', registerController)
router.get('/verify', checkAuth, verifyCodeController)
router.get('/sendcode', checkAuth, sendCodeController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:id/:token', resetPasswordController)

export default router
