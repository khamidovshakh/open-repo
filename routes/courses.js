const express = require('express')
const router = express.Router()
const Courses = require('../models/courses.js')
const LearningCenters = require('../models/LearningCenters.js')

// Маршруты для учебных центров
router.get('/', async (req, res) => {
    try {
        const data = await Courses.find({})
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

router.post('/', async (req, res) => {
    try {
        const course = new Courses(req.body)
        await course.save()

        const lc = await LearningCenters.findById(req.body.lcid)
        if (!lc) {
            return res.status(404).json({ error: 'LC not found' })
        }

        lc.courses.push(course._id)
        await lc.save()

        res.status(200).json({
            data: { lc: lc, course },
            message: 'Курс создан'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
