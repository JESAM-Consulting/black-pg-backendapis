const jwt = require("jsonwebtoken")
const messages = require("../json/message.json")

// Required Config
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token")

    // Check for token
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: messages.INVALID_TOKEN })
    }

    try {
        // Verify token
        jwt.verify(token, JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(400).json({ success: false, message: err.message })
            }
            req.user = decoded
            next()
        })

        // Add user from payload
    } catch (e) {
        return res
            .status(400)
            .json({ success: false, message: messages.INVALID_TOKEN })
    }
}
