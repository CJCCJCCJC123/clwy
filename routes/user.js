const express = require("express")
const router = express.Router()
const bcript = require("bcryptjs")
const { User, Like, Course } = require("../models")
//查询个人信息
router.get("/me", (req, res) => {
    try {
        res.json({
            status: true,
            msg: "查询成功",
            data: req.user
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
})
//修改个人信息
router.put("/update", async (req, res) => {
    try {
        const id = req.user.id
        const body = {
            nickname: req.body.nickname,
            sex: req.body.sex,
            company: req.body.company,
            sex: req.body.sex,
            introduce: req.body.introduce,
            avatar: req.body.avatar
        }
        const user = await User.findByPk(id)
        if (user) {
            await user.update(body)
            res.json({
                status: true,
                msg: "修改成功",
                data: ""
            })
        } else {
            res.status(400).json({
                status: false,
                msg: "用户没有找到",
                data: ""
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
})
//修改账号邮箱密码
router.put("/updateCount", async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)

        const body = {
            oldpassword: req.body.oldpassword,
            repassword: req.body.repassword,
            username: req.body.username,
            email: req.body.email,
            password: req.body.newpassword
        }
        if (!body.oldpassword) throw new Error("请输入密码")
        if (!body.repassword) throw new Error("请再次输入密码")
        if (body.oldpassword !== body.repassword) throw new Error("密码不一致")
        if (!bcript.compareSync(body.password, user.password)) throw new Error("密码错误")
        if (!user) throw new Error("请重新登录")
        const newUser = await user.update(body)
        delete newUser.dataValues.password
        res.json({
            status: true,
            msg: "修改成功",
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
})
//点赞/取消赞
router.post("/like", async (req, res) => {
    try {
        const body = {
            userId: req.user.id,
            courseId: req.body.courseId
        }
        const like = await Like.findOne({ where: body })
        const course = await Course.findByPk(body.courseId)
        if (!course) throw new Error("课程不存在")
        if (like) {
            await like.destroy()
            await course.decrement('likesCount')
            res.json({
                status: true,
                msg: "取消点赞成功",
            })
        } else {
            await Like.create(body)
            await course.increment('likesCount')
            res.json({
                status: true,
                msg: "点赞成功",
            })
        }
    } catch (error) {
        res.send({
            status: false,
            msg: error.message
        })
    }
})
//查询点赞课程
router.get("/likedCourse", async (req, res) => {
    try {
        const query = req.query
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const offset = (currentPage - 1) * pageSize

        const user = await User.findByPk(req.user.id)
        const course = await user.getLikeCourses({
            joinTableAttributes: [],
            attributes: { exclude: ["CategoryId", "UserId", "content"] },
            order: [["createdAt", "desc"]],
            limit: pageSize,
            offset
        })
        const count = await user.countLikeCourses()
        res.json({
            status: true,
            msg: "查询成功",
            data: {
                course,
                pagination: {
                    total: count,
                    currentPage,
                    pageSize
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
})
module.exports = router