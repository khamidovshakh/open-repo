const config = require('../config.js')

const Transactions = require('../models/transactions.js')
const Users = require('../models/users.js')
const Groups = require('../models/groups.js')
const Teachers = require('../models/teachers.js')

// Только обновление юзера и создание транзакции
const earnCoins = async params => {
    try {
        // {
        //     params: {
        //       userId: '666b649cb1457ae9d888f9d4',
        //     },
        //     code: 'homework',
        //     score: 10,
        //     balance: '+25'
        //   }

        transactionData = params.params
        transactionData.type = params.code
        transactionData.value = params.balance
        transactionData.approved = true

        // Если приходит оценка - то сохраняем ее в документе на случай удаления
        if (params.score) transactionData.score = params.score

        // Проверка валидности balance
        if (
            typeof transactionData.value !== 'string' ||
            !/^[+-]?\d+$/.test(transactionData.value)
        )
            return {
                success: false,
                message: 'Invalid balance format'
            }

        // Преобразование строки score в число
        const balanceValue = parseInt(transactionData.value, 10)
        if (isNaN(balanceValue)) {
            return res.status(400).send({ message: 'Invalid balance value' })
        }

        // Создание транзакции
        const newTransaction = new Transactions(transactionData)
        if (!newTransaction._id)
            return res.status(404).json({ error: 'Cant create transaction' })

        // Проверка студента
        const user = await Users.findById(transactionData.userId)
        if (!user._id) return res.status(404).json({ error: 'Cant find user' })

        // Обновление баланса
        user.balance += balanceValue
        user.transactions.push(newTransaction._id)

        // Сохранение изменений
        await newTransaction.save()
        await user.save()

        return {
            success: true,
            message: 'Успешно',
            transaction: newTransaction,
            user: user
        }
    } catch (error) {
        console.error('Ошибка при создании транзакции:', error)

        return {
            success: false,
            message: 'Произошла ошибка при создании транзакции'
        }
    }
}

// При исправлении оценок/посещаемости от преподавателя
const fixCoins = async transactionId => {
    // находим старую транзакцию и добавляем противоположную с ключем type: fix
    const transaction = await Transactions.findById(transactionId)
    let value = transaction.value

    // Противоположный знак чтобы выровнить баланс пользователя
    let newValue = (value.startsWith('-') ? '+' : '-') + value.substring(1)
    let obj = {
        code: 'fix',
        balance: newValue,
        params: {
            userId: transaction.userId
        }
    }

    // отправляем обработчику earnCoins
    let request = await earnCoins(obj)

    return request
}

// При тратах из баланса
const spendCoins = async transactionData => {
    try {
        const { userId, type, value, description, shopProductsId } =
            transactionData

        // Создание транзакции
        const newTransaction = await Transactions.create(transactionData)

        // Обновить баланс пользователя
        const user = await Users.findById(userId)

        if (user.balance < value) {
            return {
                success: false,
                message: 'Недостаточно средств на балансе'
            }
        }

        // update user
        user.balance -= value
        user.transactions.push(newTransaction)

        await user.save()

        return {
            success: true,
            message: 'Успешно',
            transaction: newTransaction,
            user
        }
    } catch (error) {
        console.error('Ошибка при создании транзакции:', error)

        return {
            success: false,
            message: 'Произошла ошибка при создании транзакции'
        }
    }
}

module.exports = {
    earnCoins,
    fixCoins,
    spendCoins
}
