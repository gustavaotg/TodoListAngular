const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

// pool object can access the postgres
const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'todoData',
    password: 'password',
    port: 5432
});

// List all todos
// Unfortunately, this function will get overwhelmed (and slow) 
// if there are too many todos
app.get('/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id');
        res.status(200).send(result.rows);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

// Add a todo
app.post('/todos', async (req, res) => {
    const { task } = req.body;
    try {
        // Completed will be defaulted to false (specified in the table) when adding a task
        const result = await pool.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
        res.json(result.rows[0]);
    }
    catch(err) {
        res.status(500).send(err);
    }
});


app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const result = await pool.query('UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *;', [completed, id])
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.put('/todos/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { newTask } = req.body;
    try {
        const result = await pool.query('UPDATE todos SET task = $1 WHERE id = $2 RETURNING *;', [newTask, id])
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *;', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(504).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}/`);
});

