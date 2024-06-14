const express = require('express')
const router = express.Router()
const Groups = require('../models/groups.js')
const Courses = require('../models/courses.js')
const Grades = require('../models/grades.js')
const Users = require('../models/users.js')
const LearningCenters = require('../models/LearningCenters.js')
const Lessons = require('../models/lessons.js')
const Teachers = require('../models/teachers.js')

router.get('/', async (req, res) => {
    try {
        let filter = req.query

        const data = await Groups.find(filter)
            .sort({ _id: -1 })
            .populate({ path: 'teacherId', select: 'name' })
            .populate({ path: 'courseId', select: 'title previewImage' })
            .sort({ _id: -1 })
        const message = 'Группы найдены'

        res.status(200).json({
            message,
            data
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

router.get('/transactions/:groupId', async (req, res) => {
    try {
        const data = await Groups.findById(req.params.groupId)
            .select(['transactions'])
            .populate({
                path: 'transactions',
                populate: {
                    path: 'userId',
                    select: '-password'
                },
                options: {
                    sort: { _id: -1 }, // Сортировка по убыванию _id
                    limit: 10 // Лимитирование до 10 записей
                }
            })

        const message = 'Транзакции найдены'

        res.status(200).json({
            message,
            data
        })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get('/:groupId', async (req, res) => {
    try {
        const data = await Groups.findById(req.params.groupId)
            .populate({ path: 'teacherId' })
            .populate({ path: 'courseId' })
            .populate({ path: 'lessons' })
            .populate({
                path: 'users.userId',
                model: 'Users'
            })
            .populate({
                path: 'users.grades',
                model: 'Grades',
                populate: {
                    path: 'score',
                    model: 'Scores'
                }
            })
        // .populate({
        // path: 'users',
        // populate: {
        //     path: 'grades',
        //     model: 'Grades'
        // }
        // populate: {
        //     path: 'userId'
        //     // path: 'grades'
        //     // populate: {
        //     //     // populate: 'score'
        //     // }
        // }
        // populate: {
        //     path: 'grades'
        // }
        // })
        const message = 'Elements found'
        // .populate({ path: "transactions", populate: { path: "userId" } })

        res.status(200).json({
            message,
            data
        })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

// Создание группы
router.post('/', async (req, res) => {
    try {
        const course = await Courses.findById(req.body.courseId)
        let courseLessons = []

        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        } else {
            courseLessons = course.lessons
        }

        // Создаем дополнительно 10 уроков на всякий случай если группа затянется
        let additionalLessons = []

        for (let i = 0; i < 1; i++) {
            const obj = {
                title: 'Additional'
            }

            additionalLessons.push(obj)
        }

        // Создаем эти 10 уроков в ДБ
        const createAdditionalLessons = await Lessons.insertMany(
            additionalLessons
        )
        const additionalLessonsIds = createAdditionalLessons.map(
            item => item._id
        )

        // Склеиваем уроки из курса и новые уроки
        courseLessons = courseLessons.concat(additionalLessonsIds)

        req.body.lessons = courseLessons

        // Создаем группу
        const group = new Groups(req.body)

        // Обновляем учебный центр
        const lc = await LearningCenters.findById(req.body.lcid)
        if (!lc) {
            return res.status(404).json({ error: 'LC not found' })
        }

        lc.groups.push(group._id)

        // Обновляем преподавателя
        const teacher = await Teachers.findById(req.body.teacherId)
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' })
        }

        teacher.groups.push(group._id)

        // Обновляем курс
        course.groups.push(group._id)

        await teacher.save()
        await group.save()
        await course.save()
        await lc.save()

        res.status(201).json({
            data: { lc: lc, group },
            message: 'Курс создан'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

router.patch('/add-user/:groupId/:userId', async (req, res) => {
    try {
        let lessonsArray = []
        let lessonsLength = 0
        let newUser = {
            userId: req.params.userId,
            grades: []
        }

        const group = await Groups.findOne({ _id: req.params.groupId })
        if (!group) return res.status(404).json({ error: 'Group not found' })

        lessonsLength = group.lessons.length

        const course = await Courses.findOne({ _id: group.courseId })
        if (!course) return res.status(404).json({ error: 'Course not found' })

        for (let i = 0; i < lessonsLength; i++)
            lessonsArray.push({
                userId: req.params.userId,
                groupId: req.params.groupId,
                courseId: course._id
            })

        let grades = await Grades.create(lessonsArray)

        if (!grades)
            return res.status(404).json({ error: 'Cant create grades' })

        newUser.grades = grades.map(item => item._id)

        // Работа с самой группой
        group.users.push(newUser)
        group.save()

        res.status(200).json({
            message: 'group and user updated'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

// Добавление нескольких студентов
router.patch('/add-some-users/:groupId', async (req, res) => {
    console.log('ADD SOME USERS')

    console.log(req.body)

    return

    let usersIds = req.body.usersIds
    let groupId = req.params.groupId

    if (!Array.isArray(usersIds)) {
        return res.status(400).json({ error: 'usersIds should be an array' })
    }

    try {
        const group = await Groups.findById(groupId)

        if (!group) return res.status(404).json({ error: 'Group not found' })

        // Фильтруем usersIds, чтобы исключить те, которые уже есть в группе
        const newUsers = usersIds.filter(
            userId => !group.users.includes(userId)
        )

        if (newUsers.length === 0) {
            return res.status(200).json({ message: 'No new users to add' })
        }

        // Добавляем новые usersIds в группу
        group.users.push(...newUsers)

        // Сохраняем изменения в группе
        await group.save()

        // Добавляем группу к пользователям
        await Users.updateMany(
            { _id: { $in: newUsers } },
            { $addToSet: { groups: groupId } } // $addToSet избегает дублирования
        )

        res.status(200).json({
            data: group,
            message: 'group and users updated'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
