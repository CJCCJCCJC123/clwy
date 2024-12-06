const jwt = require("jsonwebtoken")
const { User } = require("../models")

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.token) throw new Error("无token")
        const { userId } = jwt.verify(req.headers.token, process.env.secret)
        const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } })
        if (!user) throw new Error("无用户")
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
}