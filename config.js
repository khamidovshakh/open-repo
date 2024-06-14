const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

// Middleware для проверки токена аутентификации
const isUser = (req, res, next) => {
    const token = req.headers.authorization // Получаем токен из заголовка Authorization

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' })
    }

    try {
        // Разгадываем токен и проверяем его подлинность
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const role = decodedToken.role

        if (role !== 'user')
            return res
                .status(403)
                .json({ error: 'Неверный токен аутентификации' })

        // Токен успешно разгадан, получаем информацию о пользователе из токена
        req.userId = decodedToken.userId // Предполагается, что userId был добавлен в токен при создании

        next()
    } catch (error) {
        console.error(error)
        return res.status(403).json({ error: 'Неверный токен аутентификации' })
    }
}

// Middleware для проверки токена аутентификации
const isTeacher = (req, res, next) => {
    const token = req.headers.authorization // Получаем токен из заголовка Authorization

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' })
    }

    try {
        // Разгадываем токен и проверяем его подлинность
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const role = decodedToken.role

        if (role !== 'teacher' && role !== 'admin')
            return res
                .status(403)
                .json({ error: 'Неверный токен аутентификации' })

        // Токен успешно разгадан, получаем информацию о пользователе из токена
        req.userId = decodedToken.userId // Предполагается, что userId был добавлен в токен при создании

        next()
    } catch (error) {
        console.error(error)
        return res.status(403).json({ error: 'Неверный токен аутентификации' })
    }
}

// Middleware для проверки токена аутентификации
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization // Получаем токен из заголовка Authorization

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' })
    }

    try {
        // Разгадываем токен и проверяем его подлинность
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const role = decodedToken.role

        if (role !== 'admin')
            return res
                .status(403)
                .json({ error: 'Неверный токен аутентификации' })

        // Токен успешно разгадан, получаем информацию о пользователе из токена
        req.userId = decodedToken.userId // Предполагается, что userId был добавлен в токен при создании

        next()
    } catch (error) {
        console.error(error)
        return res.status(403).json({ error: 'Неверный токен аутентификации' })
    }
}

dotenv.config()

module.exports = {
    PORT: process.env.PORT,
    JWT_EXPIRATION_TIME: '30d',
    STORIES_TIME_LIMIT_DAYS: process.env.STORIES_TIME_LIMIT_DAYS,
    isUser,
    isTeacher,
    isAdmin
}
