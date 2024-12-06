const express = require("express")
const router = express.Router()
const { User, Course } = require('../../models')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
//登录login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body

        const condition = {
            include: [
                {
                    model: Course,
                    as: 'courses',
                    attributes: ['id', 'name', 'userId']
                }
            ]
        }

        if (!username || !password) {
            throw new Error("用户名或密码缺失")
        }
        const user = await User.findOne({ where: { username }, ...condition })
        if (!user) {
            throw new Error("用户名不存在")
        } else if (!await bcript.compareSync(password, user.password)) {
            throw new Error("密码错误")
        } else if (!user.role) {
            throw new Error("无权限")
        } else {
            //返回token
            const token = jwt.sign(
                {
                    userId: user.id
                },
                process.env.secret,
                {
                    expiresIn: '1h'
                }
            )
            res.json({
                status: false,
                msg: "登录成功",
                token
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
})

module.exports = router