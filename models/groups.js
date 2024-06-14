const mongoose = require('mongoose')

const Groups = mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
            required: true
        },
        teacherId: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Teachers'
        },
        preview: {
            type: String,
            default: '/default/course-preview.jpg'
        },
        progress: {
            type: Number,
            default: 0,
            max: 100
        },
        telegramLink: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        days: {
            // 1, 3, 5 or 2, 4
            // Monday is 1
            type: Array,
            required: true
        },
        location: {
            type: String
        },
        classTime: {
            type: {
                startTime: String,
                endTime: String
            },
            required: true
        },
        // groupTime: {
        //   type: {
        //     startTime: String,
        //     endTime: String,
        //   },
        // },
        lessons: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Lessons'
        },
        users: {
            type: [
                {
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Users'
                    },
                    grades: {
                        type: [mongoose.Schema.Types.ObjectId],
                        ref: 'Grades'
                    }
                }
            ]
        },
        lcid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LearningCenters',
            required: true
        },
        transactions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Transactions'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

module.exports = mongoose.model('Groups', Groups)
