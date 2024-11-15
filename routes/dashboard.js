import express from 'express'
import { pool } from '../db.js'
import { verifyToken } from '../middleware/authorization.js'

const router = express.Router()

//Read
router.get('/', verifyToken, async (req, res) => {
  try {
    //res.json(req.user)
    /*
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      req.user
    ])
    */

    const user = await pool.query(
      'SELECT * FROM users LEFT JOIN tasks ON users.user_id = tasks.user_id WHERE users.user_id = $1',
      [req.user]
    )

    res.json(user.rows)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Sever Error')
  }
})

//Create
router.post('/tasks', verifyToken, async (req, res) => {
  try {
    //console.log(req.body.name)
    //console.log(req.user)

    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, task_name, task_description, task_deadline, task_status) values ($1, $2, $3, $4, $5) RETURNING *',
      [
        req.user,
        req.body.name,
        req.body.description,
        req.body.deadline,
        req.body.status
      ]
    )

    res.json(newTask.rows[0])
  } catch (error) {
    console.error(error.message)
  }
})

//Update
router.put('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { description, name, status, deadline } = req.body

    const updateTask = await pool.query(
      'UPDATE tasks SET task_description = $1, task_name = $2, task_deadline = $3, task_status = $4 WHERE task_id = $5 AND user_id = $6 RETURNING *',
      [description, name, deadline, status, id, req.user]
    )
    if (updateTask.rows.length === 0) {
      return res.json('This task is not yours!')
    }

    res.json('Task Updated')
  } catch (error) {
    console.error(error.message)
  }
})

//Delete
router.delete('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const deleteTask = await pool.query(
      'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user]
    )

    res.json('Task Deleted!')
  } catch (error) {
    console.error(error.message)
  }
})
export default router
