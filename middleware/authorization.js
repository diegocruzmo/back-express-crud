import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    const jwtToken = req.header('token')

    if (!jwtToken) {
      return res.status(403).json({ error: 'Token not provided' })
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)

    req.user = payload.user
    next()
  } catch (error) {
    console.error(error.message)
    return res.status(403).json({ error: 'Invalid Token' })
  }
}
