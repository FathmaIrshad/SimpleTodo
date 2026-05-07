const express = require("express");          // The framework for creating our API
const { open } = require("sqlite");          // The 'sqlite' wrapper that allows us to use Promises
const sqlite3 = require("sqlite3");          // The actual database driver
const cors = require("cors");                 // Middleware to allow your React app to talk to this server

const app = express();                       // Initialize the express application
const PORT = 5000;                           // Define where our server will live

app.use(cors());                             // Enable CORS so the browser doesn't block frontend requests
app.use(express.json());                     // Lets the server read JSON data sent in the request body (req.body)

let db;                                      // Create a global variable to hold our database connection

(async () => {                               // An IIFE (Immediately Invoked Function Expression) to use 'await'
  db = await open({                          // Wait for the database file to open
    filename: "./todo.db",                   // The name of our database file
    driver: sqlite3.Database                 // Tells the wrapper to use the sqlite3 engine
  });

  // Create the table if it's the first time running the app
  await db.exec(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,    
    task TEXT NOT NULL,                      
    completed INTEGER DEFAULT 0              
  )`);                                        // 0 for false, 1 for true (SQLite doesn't have Booleans)
  
  console.log("Connected to the SQLite database.");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   //Moving app.listen() inside the IIFE (Immediately Invoked Function Expression) is a best practice to ensure your server only starts after critical asynchronous tasks—like connecting to your database—are fully completed.
})();


// Route: Get all todos
app.get("/", async (req, res) => {           // 'async' allows us to use 'await' inside the route
  try {
    const rows = await db.all("SELECT * FROM todos"); // Fetch every row from the todos table
    res.json(rows);                          // Send the list of todos back to React as JSON
  } catch (err) {
    res.status(500).send(err.message);       // If something breaks, send an error code
  }
});

// Route: Add a todo
app.post("/", async (req, res) => {
  const { task } = req.body;                 // Extract 'task' from the data React sent
  try {
    const result = await db.run(             // 'run' is used for INSERT, UPDATE, DELETE
      "INSERT INTO todos (task, completed) VALUES (?, 0)", // '?' prevents SQL Injection
      [task]                                 // Put the task variable into the '?' spot
    );
    // Send back the new item including the ID SQLite just created (lastID)
    res.json({ id: result.lastID, task, completed: 0 });   //lastID is a property on the object returned
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route: Toggle completion status
app.put("/:id", async (req, res) => {
  const { task, completed } = req.body;      // Get the new text or status
  const { id } = req.params;                 // Get the ID from the URL (e.g., /5)
  try {
    const result = await db.run(
      // COALESCE(?, task) means: "Use the new value if provided, otherwise keep the old one to accidentally overwriting your data with "empty" values
      "UPDATE todos SET task = COALESCE(?, task), completed = COALESCE(?, completed) WHERE id = ?",
      [task ?? null, completed ?? null, id]  // Ensure 'undefined' becomes 'null' for the SQL query.?? checks if undefined then assign null. if you only want to update the "completed" status, you might send a request without a "task". In your Node.js code, the variable task will be undefined that might throw an error.
    );
    res.json({ updated: result.changes });   // Returns '1' if a row was updated
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route: Delete a todo
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run("DELETE FROM todos WHERE id = ?", [id]);
    res.json({ deleted: result.changes });   // Returns '1' if a row was deleted.When you run a command like DELETE or UPDATE using the sqlite library, the result object contains a property called changes.
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// app.get("/", (req, res) => {
//   res.send("Todo List Backend is running successfully!");
// });

