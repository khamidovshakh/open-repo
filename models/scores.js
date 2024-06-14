const mongoose = require('mongoose')

const Scores = mongoose.Schema(
    {
        value: {
            type: Number
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transactions'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
)

module.exports = mongoose.model('Scores', Scores)
