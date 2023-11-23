import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();
const port = 3000;
const secretKey = 'mysecretkey';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const db = mysql.createPool({
  host: 'mysql_db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'todoapp' 
})




app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUsernameQuery, [username], (err, usernameResult) => {
    if (err) {
      console.error('Error while checking username:', err);
      res.status(500).send('An error occurred while checking the username.');
      return;
    }

    if (usernameResult.length > 0) {
      res.status(409).send('Username is already taken.');
      return;
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, emailResult) => {
      if (err) {
        console.error('Error while checking email:', err);
        res.status(500).send('An error occurred while checking the email.');
        return;
      }

      if (emailResult.length > 0) {
        res.status(409).send('Email is already taken.');
        return;
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Error while hashing the password:', err);
          res.status(500).send('An error occurred while hashing the password.');
          return;
        }

        const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, hash, email], (err, result) => {
          if (err) {
            console.error('Error while inserting the user:', err);
            res.status(500).send('An error occurred while registering the user.');
            return;
          }

          res.send('Registration successful');
        });
      });
    });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      bcrypt.compare(password, result[0].password, (err, bcryptResult) => {
        if (err) throw err;

        if (bcryptResult) {
          const token = jwt.sign({ username: result[0].username }, secretKey);
          const expiresIn = 3600; 
          const response = {
            token,
            expiresIn,
            tokenType: 'Bearer',
            authState: {
              username: result[0].username,
            },
          };

          res.cookie('token', token, { httpOnly: true });

          res.json(response);
        } else {
          res.status(401).send('Invalid username or password');
        }
      });
    }
  });
});


// Add Task
app.post('/addTask', (req, res) => {
  const { taskName, deadline, notes, priority, username } = req.body;
  const dateObject = new Date(deadline);
  const dateValue = dateObject.toISOString().split('T')[0];

  const query = `INSERT INTO tasks (taskName, deadline, notes, priority, username)
                 VALUES (?, ?, ?, ?, ?)`;
  const values = [taskName, dateValue, notes, priority, username];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error while adding a task:', error);
      res.status(500).send('An error occurred while adding a task');
    } else {
      res.status(201).json({ message: 'Task added successfully' });
    }
  });
});


app.get('/tasks/:username', (req, res) => {
  const { username } = req.params;
  const query = `
    SELECT
      t.id,
      t.taskName,
      t.deadline,
      t.notes,
      t.priority,
      t.username,
      t.createdAt,
      t.status,
      s.id AS subtaskId,
      s.taskId AS subtaskTaskId,
      s.content AS subtaskContent,
      s.username AS subtaskUsername,
      s.created_at AS subtaskCreatedAt,
      s.status AS subtaskStatus
    FROM
      tasks t
    LEFT JOIN
      subtasks s ON t.id = s.taskId
    WHERE t.username = '${username}'
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while getting tasks and subtasks:', error);
      res.status(500).json({ error: 'An error occurred while getting the tasks and subtasks' });
    } else {
      const tasks = {};
      results.forEach((row) => {
        const taskId = row.id;
        if (!tasks[taskId]) {
          tasks[taskId] = {
            id: taskId,
            taskName: row.taskName,
            deadline: row.deadline,
            notes: row.notes,
            priority: row.priority,
            username: row.username,
            createdAt: row.createdAt,
            status: row.status,
            subtasks: [],
          };
        }

        if (row.subtaskId) {
          tasks[taskId].subtasks.push({
            id: row.subtaskId,
            taskId: row.subtaskTaskId,
            content: row.subtaskContent,
            username: row.subtaskUsername,
            created_at: row.subtaskCreatedAt,
            status: row.subtaskStatus,
          });
        }
      });

      const tasksArray = Object.values(tasks);

      res.status(200).json(tasksArray);
    }
  });
});



// Endpoint for adding a subtask
app.post('/tasks/:taskId/subtasks', (req, res) => {
  const { taskId } = req.params;
  const { content, username } = req.body;

  const query = `INSERT INTO subtasks (taskId, content, username) VALUES (?, ?, ?)`;
  const values = [taskId, content, username];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error while adding a subtask:', error);
      res.status(500).json({ error: 'An error occurred while adding the subtask' });
    } else {
      res.status(201).json({ message: 'Subtask added successfully' });
    }
  });
});

//Delete subtask
app.delete('/subtasks/:subtaskId', (req, res) => {
  const { subtaskId } = req.params;

  const query = `
    DELETE FROM subtasks
    WHERE id = ${subtaskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while deleting subtask:', error);
      res.status(500).json({ error: 'An error occurred while deleting the subtask' });
    } else {
      res.status(200).json({ message: 'Subtask deleted successfully' });
    }
  });
});

//update subtask status
app.put('/subtasks/:subtaskId/toggleStatus', (req, res) => {
  const { subtaskId } = req.params;

  const query = `
    UPDATE subtasks
    SET status = CASE
      WHEN status = 'completed' THEN 'todo'
      WHEN status = 'todo' THEN 'completed'
      ELSE status
    END
    WHERE id = ${subtaskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while toggling subtask status:', error);
      res.status(500).json({ error: 'An error occurred while toggling the subtask status' });
    } else {
      res.status(200).json({ message: 'Subtask status toggled successfully' });
    }
  });
});


// Zmiana statusu taska na "todo"
app.put('/tasks/:taskId/todo', (req, res) => {
  const { taskId } = req.params;

  const query = `
    UPDATE tasks
    SET status = 'todo'
    WHERE id = ${taskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while updating task status:', error);
      res.status(500).json({ error: 'An error occurred while updating the task status' });
    } else {
      res.status(200).json({ message: 'Task status updated to "todo" successfully' });
    }
  });
});

// Zmiana statusu taska na "inprogress"
app.put('/tasks/:taskId/inprogress', (req, res) => {
  const { taskId } = req.params;

  const query = `
    UPDATE tasks
    SET status = 'inprogress'
    WHERE id = ${taskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while updating task status:', error);
      res.status(500).json({ error: 'An error occurred while updating the task status' });
    } else {
      res.status(200).json({ message: 'Task status updated to "inprogress" successfully' });
    }
  });
});

// Zmiana statusu taska na "completed"
app.put('/tasks/:taskId/completed', (req, res) => {
  const { taskId } = req.params;

  const query = `
    UPDATE tasks
    SET status = 'completed'
    WHERE id = ${taskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while updating task status:', error);
      res.status(500).json({ error: 'An error occurred while updating the task status' });
    } else {
      res.status(200).json({ message: 'Task status updated to "completed" successfully' });
    }
  });
});

app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;

  const query = `
    DELETE FROM tasks
    WHERE id = ${taskId}
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error while deleting task:', error);
      res.status(500).json({ error: 'An error occurred while deleting the task' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



  

