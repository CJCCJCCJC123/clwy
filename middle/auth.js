const jwt = require("jsonwebtoken")
const { User } = require("../models")

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            throw new Error('没有token')
        }
        const decoded = jwt.verify(token, process.env.secret)
        const { userId } = decoded
        const user = await User.findByPk(userId)
        if (!user) {
            throw new Error("用户不存在")
        } else if (!user.role) {
            throw new Error("无权限")
        } else {
            req.user = user
            next()
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message + "/token"
        })
    }
}