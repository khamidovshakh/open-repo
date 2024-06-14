const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment')
const app = express()
const bodyParse = require('body-parser')

require('dotenv').config()

app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(bodyParse.json())

// Подключение роутера, сканирующего и подключающего все маршруты
const routes = require('./routes')

// Использование роутера
app.use('/', routes)

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

// Connect to Database
if (process.env.NODE_ENV === 'production') {
    console.log('PRODUCTION MODE')

    // connect

    mongoose.set('debug', false)
} else {
    console.log('DEV MODE')
    mongoose.connect(`mongodb://localhost:27017/crm`, err => {
        if (err) console.log(err)
        else console.log('c o n n e c t e d')
    })

    mongoose.set('debug', false)
}

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Listening ${process.env.PORT}`)
})
