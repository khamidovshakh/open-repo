const express = require('express')
const router = express.Router()
const Users = require('../models/users.js')
const LearningCenters = require('../models/LearningCenters.js')

// Маршруты для учебных центров
router.get('/', async (req, res) => {
    try {
        const data = await Users.find({})
        const message = 'Elements found'

        res.status(200).json({
            message,
            data
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

router.post('/many', async (req, res) => {
    try {
        const users = await Users.insertMany(req.body.arr)
        const lc = await LearningCenters.findById(req.body.lcid)

        if (!lc) return res.status(404).json({ error: 'LC not found' })

        // Обновляем центр, добавляя пользователей
        lc.users.push(...users.map(user => user._id))

        // Сохраняем изменения в центре
        await lc.save()

        res.status(200).json({ data: { lc, users }, message: 'Курс создан' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
