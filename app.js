import userAuth from './routes/jwtAuth.js'
import userDashboard from './routes/dashboard.js'
import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cors())

//Routes
//Register and login
app.use('/auth', userAuth)
//Dashboard
app.use('/dashboard', userDashboard)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
