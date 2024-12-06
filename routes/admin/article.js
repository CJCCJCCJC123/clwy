const express = require("express")
const router = express.Router()

const { Article } = require('../../models')
const { Op } = require('sequelize')

//查询所有文章
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
        if (req.query.title) {
            condiction.where = {
                title: {
                    [Op.like]: `%${req.query.title}%`
                }
            }
        }
        const { count, rows: row } = await Article.findAndCountAll(condiction)
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
//按照id查询文章
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const article = await Article.findByPk(id)
        if (!article) {
            return res.status(404).json({
                status: false,
                message: "不存在",
                data: article
            })
        }
        return res.json({
            status: true,
            message: "查询成功",
            data: article
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "查询失败",
            data: ""
        })
    }
})
//新建文章
router.post("/", async (req, res) => {
    const body = {
        title: req.body.title,
        content: req.body.content
    }
    try {
        const article = await Article.create(body)

        res.status(201).json({
            status: true,
            message: "创建文章成功。",
            data: article
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "创建文章失败",
            error: error.message
        })
    }
})
//删除文章
router.delete("/:id", async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id)
        if (article) {
            await article.destroy()
            res.json({
                status: true,
                messgae: '删除文章成功'
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "文章未找到"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "删除失败"
        })
    }
})
//更新文章
router.put("/:id", async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id)
        if (article) {
            await article.update(req.body)
            res.json({
                status: true,
                messgae: '更新文章成功',
                article
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "文章未找到"
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
                message: "删除失败"
            })
        }

    }
})
module.exports = router