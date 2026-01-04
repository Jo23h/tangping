const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const tokenWithoutBearer = token.split(' ')[1]

    // Allow bypass for local testing with mock token
    if (tokenWithoutBearer === 'local-test-token') {
        req.user = {
            userId: 'local-test-user-id',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user' // Set as regular user, not guest
        }
        return next()
    }

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' })
    }
}
module.exports = verifyToken