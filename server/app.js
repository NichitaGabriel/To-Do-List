const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const tasksFilePath = path.join(__dirname, 'tasks.json');

const getTasks = () => {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
};

const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

app.get('/tasks', (req, res) => {
    res.json(getTasks());
});

app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    tasks.push(req.body);
    saveTasks(tasks);
    res.status(201).json(req.body);
});

app.put('/tasks', (req, res) => {
    const tasks = getTasks();
    const index = tasks.findIndex(task => task.text === req.body.text);
    if (index !== -1) {
        tasks[index].completed = req.body.completed;
        saveTasks(tasks);
        res.status(200).json(tasks[index]);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/tasks', (req, res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.text !== req.body.text);
    saveTasks(tasks);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
