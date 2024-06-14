const express = require('express')
const router = express.Router()
const Teachers = require('../models/teachers.js')
const LearningCenters = require('../models/LearningCenters.js')

// Маршруты для учебных центров
router.get('/', async (req, res) => {
    try {
        let filter = req.query

        const data = await Teachers.find(filter)
        const message = 'Преподаватели найдены'

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
        const teacher = new Teachers(req.body)
        await teacher.save()

        const lc = await LearningCenters.findById(req.body.lcid)
        if (!lc) {
            return res.status(404).json({ error: 'LC not found' })
        }

        lc.teachers.push(teacher._id)
        await lc.save()

        res.status(200).json({
            data: { lc: lc, teacher },
            message: 'Преподаватель создан'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
