const express = require("express")
const app = express()

const server = app.listen(4000, () => {
    console.log('server is working on port');
})

const task = require("./routes/taskRoute");
const { getAllTasks } = require("./controller/taskController");
app.get('/api/tasks',getAllTasks)



// app.use("/api/", task)