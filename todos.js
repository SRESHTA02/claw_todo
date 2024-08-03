const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./database');
const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

router.post('/todos', authenticate, (req, res) => {
    const { description, status } = req.body;
    const query = `INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)`;
    db.run(query, [req.user.id, description, status], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

router.get('/todos', authenticate, (req, res) => {
    const query = `SELECT * FROM todos WHERE user_id = ?`;
    db.all(query, [req.user.id], (err, todos) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(todos);
    });
});

router.put('/todos/:id', authenticate, (req, res) => {
    const { description, status } = req.body;
    const query = `UPDATE todos SET description = ?, status = ? WHERE id = ? AND user_id = ?`;
    db.run(query, [description, status, req.params.id, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

router.delete('/todos/:id', authenticate, (req, res) => {
    const query = `DELETE FROM todos WHERE id = ? AND user_id = ?`;
    db.run(query, [req.params.id, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

module.exports = router;
