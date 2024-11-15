import express from 'express'
import { pool } from '../db.js'
import bcrypt from 'bcrypt'
import { jwtGenerator } from '../utils/jwtGenerator.js'
import { verifyToken } from '../middleware/authorization.js'

const router = express.Router()

//Register route
router.post('/register', async (req, res) => {
  try {
    //1. Destructure the req.body (firstname, lastname, email, password)
    const { firstname, lastname, email, password } = req.body

    //2. Check if the user already exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email
    ])

    if (user.rows.length !== 0) {
      return res.status(401).json('User already exists!')
    }

    //3. Bcrypt user_password
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const bcryptPassword = await bcrypt.hash(password, salt)

    //4. Save user in DB
    const newUser = await pool.query(
      'INSERT INTO users (user_firstname, user_lastname, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, lastname, email, bcryptPassword]
    )

    //5. Generate JWT
    const token = jwtGenerator(newUser.rows[0].user_id)

    //6. Return JWT
    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Sever Error')
  }
})

//Login route
router.post('/login', async (req, res) => {
  try {
    //1. Destructure the req.body (email, password)
    const { email, password } = req.body

    //2. Check if the user doesn't exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email
    ])

    if (user.rows.length === 0) {
      return res.status(401).json('User does not exists!')
    }

    //3. Check the password
    const checkPass = await bcrypt.compare(password, user.rows[0].user_password)

    if (!checkPass) {
      return res.status(401).json('Password incorrect !')
    }

    //5. Generate JWT
    const token = jwtGenerator(user.rows[0].user_id)

    //6. Return JWT
    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Sever Error')
  }
})

router.get('/is-verify', verifyToken, async (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Sever Error')
  }
})

export default router
