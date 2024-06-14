const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs') // Для хеширования паролей
const jwt = require('jsonwebtoken')
const config = require('../config.js')

const Admins = require('../models/admins.js')

router.get('/check/:role', async (req, res, next) => {
    const role = req.params.role

    try {
        let token = req.headers.token

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'unauthorized'
                })
            }

            if (role == 'manager' || role == 'admin') {
                Admins.findOne({ _id: decoded.userId }, (error, data) => {
                    if (data) {
                        if (data.role === req.params.role) {
                            res.status(200).json({
                                message: 'good',
                                user: data
                            })
                        } else {
                            res.status(403).json({
                                message: 'no auth'
                            })
                        }
                    } else {
                        res.status(403).json({
                            message: 'no auth'
                        })
                    }
                })
            }
        })
    } catch (error) {
        res.json({ message: error })
    }
})

// Регистрация администратора
router.post('/register/admins', async (req, res) => {
    try {
        req.body.phone = req.body.phone.replace(/\D/g, '')
        const { phone, password, lcid, name, birthday, sex, role } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = new Admins({
            phone,
            name,
            birthday,
            sex,
            role,
            lcid,
            password: hashedPassword
        })

        // Сохраняем админа в базу данных
        await admin.save()

        res.status(200).json({
            data: admin,
            message: 'Руководство зарегистрировано'
        })
    } catch (error) {
        console.error('Ошибка при регистрации руководства: ', error)
        res.status(500).json({ message: 'Внутренняя ошибка сервера' })
    }
})

// Роут для входа (аутентификации)
router.post('/login/:role', async (req, res) => {
    try {
        req.body.phone = req.body.phone.replace(/\D/g, '')
        const { role, phone, password } = req.body

        const user = await Admins.findOne({ phone })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ message: 'Неправильное имя пользователя или пароль' })
        }

        const token = jwt.sign(
            { userId: user._id, phone: user.phone, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION_TIME }
        )

        delete user.password

        await res.json({ data: user, token, role: user.role })
    } catch (error) {
        console.error('Ошибка при входе:', error)
        res.status(500).json({ message: 'Внутренняя ошибка сервера', error })
    }
})

module.exports = router
