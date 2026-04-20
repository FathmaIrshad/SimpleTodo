const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to SQLite (it will create todo.db automatically)
const db = new sqlite3.Database("./todo.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL,
  completed INTEGER DEFAULT 0
)`);

// Route: Get all todos
app.get("/", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) res.status(500).send(err.message);
    res.json(rows);
  });
});

// Route: Add a todo
app.post("/", (req, res) => {
  const { task } = req.body;
  db.run(
    "INSERT INTO todos (task,completed) VALUES (?,0)",
    [task],
    function (err) {
      if (err) res.status(500).send(err.message);
      res.json({ id: this.lastID, task, completed: 0 });
    }
  );
});

// Route: Toggle completion status
app.put("/:id", (req, res) => {
  const { task, completed } = req.body;
  const { id } = req.params;

  // This SQL updates whichever value you send (task or completed)
  db.run(
    "UPDATE todos SET task = COALESCE(?, task), completed = COALESCE(?, completed) WHERE id = ?",
    [task, completed, id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ updated: this.changes });
    }
  );
});

// Route: Delete a todo
app.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ deleted: this.changes });
  });
});

// app.get("/", (req, res) => {
//   res.send("Todo List Backend is running successfully!");
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
