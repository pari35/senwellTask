const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })
const bodyparser = require('body-parser')
const app = express()
const PORT = process.env.port || 4000
const jwt = require('jsonwebtoken');
require('./db/conn')
const router = new express.Router()
app.use(express.json())
const server = app.listen(PORT, () => {
    console.log(`server is working on port ${PORT}`);
})

const taskSchema = require('./models/tasks')
const { userReisterValidate } = require('../utils/userValidation')
const bodyParser = require('body-parser')

const user = require('./models/user')
app.use(bodyParser.json())
const joi = require('joi')
const bcrypt = require('bcrypt')
const ensureAuthenticated = require('../utils/auth')
const routes = express.Router()
// post request for tasks
app.post('/api/tasks', ensureAuthenticated, async (req, res) => {
    try {
        const createTasks = await taskSchema.create(req.body);
        res.status(200).json({
            success: true,
            createTasks
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/api/tasks', ensureAuthenticated, async (req, res) => {
    try {
        const taskList = await taskSchema.find({ dateOfJoining: { $gte: req.query.dateOfJoining } });
        res.status(200).json({
            success: true,
            taskList
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

// get task by id
app.get('/api/tasks/:id', ensureAuthenticated, async (req, res) => {
    (req, res)
    try {
        const taskList = await taskSchema.findById(req.params.id);
        res.status(200).json({
            success: true,
            taskList
        })

    } catch (e) {
        res.status(400).send(e)
    }
})

//put 
app.put('/api/tasks/:id',ensureAuthenticated, async (req, res) => {
    try {
        const updatedTask = await taskSchema.findByIdAndUpdate(req.params.id, req.body);
        res.status(500).json({
            success: true,
            updatedTask
        })

    } catch (e) {
        res.status(400).send(e)
    }
})

//delete 
app.delete('/api/tasks/:id',ensureAuthenticated, async (req, res) => {
    try {
        const deletedTask = await taskSchema.findByIdAndDelete(req.params.id, req.body);
        res.status(500).json({
            success: true,
            deletedTask
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/api/tasks/register', async (req, res, next) => {

    const schema = joi.object({
        fullName: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).alphanum().required()
    })
    const { error, value } = schema.validate(req.body)
    // if (error) {
    //     return res.status(400).json({ message: "Bad request", error })
    // }
    // next()
    const userModel = new user(req.body)
    userModel.password = await bcrypt.hash(req.body.password, 10)
    try {
        const response = await userModel.save()
        response.password = undefined
        return res.status(201).json({ message: 'success', data: response })
    }
    catch (e) {
        console.log(e)

        return res.status(500).json({ message: e })

    }
})


app.post('/api/tasks/login', async (req, res, next) => {

    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).alphanum().required()
    })
    const { error, value } = schema.validate(req.body)

    try {
        const userData = await user.findOne({ email: req.body.email })
        console.log('first', userData)
        if (!userData) {
            return res.status(401).json({
                message: 'Invalid username / password'
            })
        }

        const passwordAuth = await bcrypt.compare(req.body.password, userData.password)
        if (!passwordAuth) {
            return res.status(401).json({
                message: 'Invalid username / password'
            })
        }
        const tokenObject = {
            __id: userData.id,
            fullName: userData.fullName,
            email: userData.email
        }
        const jwtToken = jwt.sign(tokenObject, "secret", { expiresIn: '4h' })
        return res.status(200).json({ jwtToken, tokenObject })
    }
    catch (e) {
        console.log(e)

        return res.status(500).json({ message: e })

    }
})

