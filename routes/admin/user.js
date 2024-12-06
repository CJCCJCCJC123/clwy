const express = require("express")
const router = express.Router()

const { User } = require('../../models')
const { Op } = require('sequelize')

//查询所有用户
router.get('/', async (req, res) => {
    try {
        const currentPage = Math.abs(req.query.currentPage) || 1
        const pageSize = Math.abs(req.res.pageSize) || 10
        const offset = pageSize * (currentPage - 1)

        const condiction = {
            order: [["id", "desc"]],
            limit: pageSize,
            offset
        }
        if (req.query.email) {
            condiction.where = {
                email: {
                    [Op.eq]: req.query.email
                }
            }
        }
        if (req.query.username) {
            condiction.where = {
                username: {
                    [Op.eq]: req.query.username
                }
            }
        }
        if (req.query.role) {
            condiction.where = {
                role: {
                    [Op.eq]: req.query.role
                }
            }
        }

        if (req.query.nickname) {
            condiction.where = {
                nickname: {
                    [Op.like]: `%${req.query.nickname}%`
                }
            }
        }
        const { count, rows: row } = await User.findAndCountAll(condiction)
        res.json({
            status: true,
            message: "查询成功",
            data: row,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message,
            data: ""
        })
    }
})
//按照id查询用户
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "不存在",
                data: user
            })
        }
        return res.json({
            status: true,
            message: "查询成功",
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "查询失败",
            data: ""
        })
    }
})
//新建用户
router.post("/", async (req, res) => {
    const body = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        avatar: req.body.avatar,
        role: req.body.role
    }
    try {
        const user = await User.create(body)

        res.status(201).json({
            status: true,
            message: "创建用户成功。",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "创建用户失败",
            error: error.message
        })
    }
})

//更新用户
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        const body = {
            eamil: req.body.eamil,
            username: req.body.username,
            password: req.body.password,
            nickname: req.body.nickname,
            sex: req.body.sex,
            company: req.body.company,
            introduce: req.body.introduce,
            avatar: req.body.avatar,
            role: req.body.role
        }
        if (user) {
            await user.update(body)
            res.json({
                status: true,
                messgae: '更新用户成功',
                user
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "用户未找到"
            })
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            let errors = []
            errors = error.errors.map(ele => ele.message)
            res.status(400).json({
                status: false,
                message: errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: "更新失败"
            })
        }

    }
})

module.exports = router