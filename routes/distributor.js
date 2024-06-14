const express = require('express')
const router = express.Router()
const Grades = require('../models/grades.js')
const Users = require('../models/users.js')
const Groups = require('../models/groups.js')
const Scores = require('../models/scores.js')
const Lessons = require('../models/lessons.js')
const Transactions = require('../models/transactions.js')

const transactionsService = require('../services/transactions-service.js')

router.patch('/delete-score', async (req, res) => {
    try {
        // {
        //     params: {
        //       gradeId: '666b5732fdfcc754e48c8c38',
        //       userId: '666b5732fdfcc754e48c8c23',
        //       groupId: '666b5732fdfcc754e48c8c2c',
        //       courseId: '666b5732fdfcc754e48c8c1e'
        //     },
        //     scoreTransactionId: '666b5745fdfcc754e48c8c6f',
        //     score: 10
        // }
        let { gradeId, userId, groupId } = req.body.params
        let transactionId = req.body.scoreTransactionId
        let score = req.body.score

        // найти документы
        let transaction = await Transactions.findById(transactionId)
        if (!transaction._id)
            return res.status(404).json({ error: 'Transaction not found' })

        let user = await Users.findById(userId)
        if (!user._id) return res.status(404).json({ error: 'User not found' })

        let grade = await Grades.findById(gradeId)
        if (!grade._id)
            return res.status(404).json({ error: 'Grade not found' })

        let group = await Groups.findById(groupId)
        if (!group._id)
            return res.status(404).json({ error: 'Group not found' })

        // обновить баланс у пользователя
        transactionsService.fixCoins(transactionId)

        // Найти grade, чтобы удалить из него нужны score
        await grade.score.pull(score._id)
        await grade.transactionId.pull(transactionId)
        await grade.save()

        // удалить транзакцию
        await transaction.remove()

        // обновить транзакции у пользователя
        await user.transactions.pull(transactionId)
        await user.save()

        // обновить транзакции у группы
        await group.transactions.pull(transactionId)
        await group.save()

        return res.status(200).json({
            message: 'Балл удален'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

// Добавление оценки студенту
router.post('/', async (req, res) => {
    try {
        // {
        //     params: {
        //       gradeId: '6669ea6f238be7fb5c14bb3b',
        //       userId: '6669ea6f238be7fb5c14baf1',
        //       groupId: '6669ea6f238be7fb5c14bb0a',
        //       courseId: '6669ea6f238be7fb5c14baeb'
        //     },
        //     code: 'homework',
        //     score: '+10',
        //     balance: '+25'
        //   }

        let type = req.body.code

        if (type == 'homework') {
            // Обновить баланс пользователя
            const transactionStatus = await transactionsService.earnCoins(
                req.body
            )

            if (!transactionStatus.success)
                return res
                    .status(500)
                    .json({ message: transactionStatus.message })

            // Обновить ячейку
            const grade = await Grades.findById(req.body.params.gradeId)
            if (!grade._id)
                return res.status(404).json({ error: 'Grade not found' })

            // Обновить транзакции группы
            const group = await Groups.findById(req.body.params.groupId)
            if (!group._id)
                return res.status(404).json({ error: 'Group not found' })

            group.transactions.push(transactionStatus.transaction._id)
            await group.save()

            // Создать оценку
            const score = new Scores({
                value: parseInt(req.body.score, 10),
                transactionId: transactionStatus.transaction._id
            })
            await score.save()

            // Сохранить ячейку
            grade.transactionId.push(transactionStatus.transaction._id)
            grade.score.push(score._id)
            await grade.save()

            return res.status(200).json({
                message: 'Балл добавлен',
                userId: req.body.params.userId,
                gradeId: req.body.params.gradeId,
                score: req.body.score
            })
        }

        if (type == 'attendance') {
            // Обновить баланс пользователя
            const transactionStatus = await transactionsService.earnCoins(
                req.body
            )

            if (!transactionStatus.success)
                return res
                    .status(500)
                    .json({ message: transactionStatus.message })

            // Обновить ячейку
            const grade = await Grades.findById(req.body.params.gradeId)
            if (!grade._id)
                return res.status(404).json({ error: 'Grade not found' })

            // Обновить транзакции группы
            const group = await Groups.findById(req.body.params.groupId)
            if (!group._id)
                return res.status(404).json({ error: 'Group not found' })

            // Проверка на посещаемость (если была)
            // Если посещаемость еще не поставлена
            if (grade.attendance == 1) {
                group.transactions.push(transactionStatus.transaction._id)
                await group.save()

                // Сохранить ячейку
                grade.attendance = req.body.value
                await grade.save()

                return res.status(200).json({
                    message: 'Посещаемость сохранена'
                })
            }

            // Если посещаемость повторяется с тем что было сохранено
            if (
                (grade.attendance == 2 && req.body.value == 2) ||
                (grade.attendance == 3 && req.body.value == 3)
            ) {
                return res.status(200).json({
                    message: 'Уже отмечено'
                })
            }
        }

        if (type == 'classwork') {
            // Обновить баланс пользователя
            const transactionStatus = await transactionsService.earnCoins(
                req.body
            )

            if (!transactionStatus.success)
                return res
                    .status(500)
                    .json({ message: transactionStatus.message })

            // Обновить транзакции группы
            const group = await Groups.findById(req.body.params.groupId)
            if (!group._id)
                return res.status(404).json({ error: 'Group not found' })

            group.transactions.push(transactionStatus.transaction._id)
            await group.save()

            return res.status(200).json({
                message: 'Изменения применены'
            })
        }

        return

        // Если такая оценка уже была - пополняем
        let grade = await Grades.findOne({ userId, lessonId })

        if (!grade || grade == null || grade == undefined || grade == false) {
            grade = new Grades(req.body)
        } else {
            console.log('PATCH OLD')
            // grade = new Grades(req.body);
        }

        await grade.save()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error, message: 'Bug processing the request' })
    }
})

module.exports = router
