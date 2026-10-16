const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const getTasks = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get('/api/tasks', (req, res) => {
  res.json(getTasks());
});

app.post('/api/tasks', (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    category: req.body.category || 'General',
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.json({ message: 'Task removed' });
});

app.listen(PORT, () => {
  console.log(`Server running live at http://localhost:${PORT}`);
});
