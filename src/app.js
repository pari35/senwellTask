const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })
const app = express()
const PORT = process.env.port || 4000
require('./db/conn')
const router = new express.Router()
app.use(express.json())
const server = app.listen(PORT, () => {
    console.log(`server is working on port ${PORT}`);
})
const taskSchema = require('./models/tasks')

// post request for tasks
app.post('/api/tasks', async (req, res) => {
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

app.get('/api/tasks', async (req, res) => {
    try {
        const taskList = await taskSchema.find({dateOfJoining :{$gte:req.query.dateOfJoining}});
        res.status(200).json({
            success: true,
            taskList
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

// get task by id
app.get('/api/tasks/:id', async (req, res) => {
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
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await taskSchema.findByIdAndUpdate(req.params.id,req.body);
        res.status(500).json({
            success: true,
            updatedTask
        })

    } catch (e) {
        res.status(400).send(e)
    }
})

//delete 
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await taskSchema.findByIdAndDelete(req.params.id,req.body);
        res.status(500).json({
            success: true,
            deletedTask
        })
    } catch (e) {
        res.status(400).send(e)
    }
})