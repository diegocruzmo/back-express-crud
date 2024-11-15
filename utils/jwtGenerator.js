import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}
