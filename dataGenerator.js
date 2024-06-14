const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const axios = require('axios')
const models = require('./models')

// ENV
require('dotenv').config()

// Only for local usage
const devEndpoint = process.env.DEV_ENDPOINT
const endpoint = devEndpoint

mongoose.connect('mongodb://localhost:27017/crm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function generateRandomLearningCenter() {
    const obj = {
        plan: 'pro',
        title: faker.company.name(),
        foundationYear: 2015,
        locations: [
            {
                title: faker.location.city(),
                location: faker.location.secondaryAddress()
            }
        ],
        contacts: {
            callCenter: faker.datatype.number(),
            techSupport: faker.datatype.number(),
            additional: faker.datatype.number()
        }
    }

    const url = endpoint + '/learning-centers'
    const response = await axios.post(url, obj)

    return response.data
}

async function generateRandomLessons() {
    const arr = []

    const iterations = 5

    for (let i = 0; i < iterations; i++) {
        arr.push(faker.company.name())
    }

    const url = endpoint + '/lessons'
    const response = await axios.post(url, arr)

    return response.data
}

async function generateRandomTeachers({ lcid }) {
    const iterations = 1
    let array = []

    for (let i = 0; i < iterations; i++) {
        const obj = {
            phone: faker.phone.number(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            avatar: 'https://picsum.photos/400/400',
            lcid
        }

        const url = endpoint + '/teachers'
        const response = await axios.post(url, obj)

        array.push(response.data.data.teacher)
    }

    return array
}

async function generateRandomCourses({ lcid, lessons }) {
    const iterations = 1
    let array = []

    for (let i = 0; i < iterations; i++) {
        const obj = {
            title: faker.company.name(),
            lessons,
            image: 'https://picsum.photos/500/300',
            lcid
        }

        const url = endpoint + '/courses'
        const response = await axios.post(url, obj)

        array.push(response.data.data.course)
    }

    return array
}

async function generateRandomUsers({ lcid }) {
    let obj = {
        arr: [],
        lcid
    }

    const iterations = 2

    for (let i = 0; i < iterations; i++) {
        obj.arr.push({
            phone: faker.phone.number(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            avatar: 'https://picsum.photos/400/400',
            lcid
        })
    }

    const url = endpoint + '/users/many'
    const response = await axios.post(url, obj)

    return response.data
}

async function generateRandomGroups({
    lcid,
    courseId,
    teacherId
    // lessons,
    // users,
}) {
    const iterations = 1
    let array = []

    for (let i = 0; i < iterations; i++) {
        const obj = {
            courseId,
            teacherId,
            preview: 'https://picsum.photos/500/300',
            days: [1, 3, 5],
            progress: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
            // lessons,
            classTime: {
                startTime: '12:00',
                endTime: '14:00'
            },
            lcid
        }

        const url = endpoint + '/groups'
        const response = await axios.post(url, obj)

        array.push(response.data.data.group)
    }

    return array
}

async function addUsersToGroup({ groupId, usersIds }) {
    for (let item of usersIds) {
        const url = endpoint + '/groups/add-user/' + groupId + '/' + item
        const response = await axios.patch(url)
    }
}

async function generateData() {
    // first create lc
    const learningCenterRequest = await generateRandomLearningCenter()
    const learningCenter = learningCenterRequest.data

    // teachers before group
    const teachersRequest = await generateRandomTeachers({
        lcid: learningCenter._id
    })
    const teachers = teachersRequest

    // lessons after lc
    const lessonsRequest = await generateRandomLessons()
    const lessons = lessonsRequest

    // course before group
    const coursesRequest = await generateRandomCourses({
        lcid: learningCenter._id,
        lessons
    })
    const courses = coursesRequest

    // users before group
    const usersRequest = await generateRandomUsers({
        lcid: learningCenter._id
    })
    const users = usersRequest.data.users

    // create group after other creatings
    const groupsRequest = await generateRandomGroups({
        lcid: learningCenter._id,
        courseId: courses[Math.floor(Math.random() * courses.length)]._id,
        teacherId: teachers[Math.floor(Math.random() * teachers.length)]._id
    })
    let groups = groupsRequest

    // push people to group
    let usersIds = users.map(item => item._id) // user goes to id
    const updatedGroupRequest = await addUsersToGroup({
        groupId: groups[Math.floor(Math.random() * groups.length)]._id,
        usersIds
    })
    let updatedGroup = updatedGroupRequest

    // create grades
}

// Запуск генерации данных
generateData()
    .then(() => mongoose.disconnect())
    .catch(error => {
        console.error('Error generating data:', error)
        mongoose.disconnect()
    })
