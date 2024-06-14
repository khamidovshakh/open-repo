const mongoose = require('mongoose')

const Transactions = mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                'homework',
                'classwork',
                'attendance',
                
                'fix',
                'shop',
                'system',
                'register'
            ],
            required: true
        },
        value: {
            // '+10' или '-10'
            type: String,
            required: true
        },
        score: {
            type: Number
        },
        description: {
            type: String
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        shopProductsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shopProducts'
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'groups'
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teachers'
        },
        approved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

module.exports = mongoose.model('Transactions', Transactions)
