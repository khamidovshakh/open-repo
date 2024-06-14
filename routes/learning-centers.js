const express = require('express')
const router = express.Router()
const LearningCenters = require('../models/LearningCenters.js')

// Маршруты для учебных центров
router.get('/', async (req, res) => {
    try {
        let filter = req.query

        const data = await LearningCenters.find(filter)
        const message = 'Учебные центры загружены'

        res.status(200).json({
            message,
            data
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

router.post('/', async (req, res) => {
    try {
        const data = await LearningCenters.create(req.body)

        if (data._id) {
            const message = 'Element created'

            res.status(200).json({
                message,
                data
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
