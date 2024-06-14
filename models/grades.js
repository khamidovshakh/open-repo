const mongoose = require('mongoose')

const Grades = mongoose.Schema(
    {
        // Оценки хранятся в отдельной модели для корректного удалени/ищменения
        // У каждой оценки своя transactionId
        score: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Scores'
        },
        attendance: {
            type: Number,
            // 1 - is not set
            // 2 - is not here
            // 3 - is here
            enum: [1, 2, 3],
            default: 1
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lessons'
        },
        transactionId: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Transactions'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Groups'
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
)

module.exports = mongoose.model('Grades', Grades)
