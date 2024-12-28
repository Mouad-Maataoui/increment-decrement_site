const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const db = new sqlite3.Database('./counter.db');

db.run(`CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, value INTEGER)`, () => {
    db.run(`INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0)`);
});

app.get('/api/counter', (req, res) => {
    db.get(`SELECT value FROM counter WHERE id = 1`, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ counter: row.value });
        }
    });
});

app.post('/api/counter', (req, res) => {
    db.run(`UPDATE counter SET value = value + 1 WHERE id = 1`, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            db.get(`SELECT value FROM counter WHERE id = 1`, (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ counter: row.value });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
