const express = require("express")
const router = express.Router()

const { Category, Course } = require('../../models')
const { Op } = require('sequelize')

//查询所有分类
const getCondiction = () => {
    return {
        include: [
            {
                model: Course,
                as: 'courses',
                attributes: ['id', 'name', 'userId']
            }
        ]
    }
}
router.get('/', async (req, res) => {
    try {
        const currentPage = Math.abs(req.query.currentPage) || 1
        const pageSize = Math.abs(req.res.pageSize) || 10
        const offset = pageSize * (currentPage - 1)

        const condiction = {
            ...getCondiction(),
            order: [["id", "desc"]],
            limit: pageSize,
            offset
        }
        if (req.query.name) {
            condiction.where = {
                name: {
                    [Op.like]: `%${req.query.name}%`
                }
            }
        }
        const { count, rows: row } = await Category.findAndCountAll(condiction)
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
//按照id查询分类
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "不存在",
                data: category
            })
        }
        return res.json({
            status: true,
            message: "查询成功",
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "查询失败",
            data: ""
        })
    }
})
//新建分类
router.post("/", async (req, res) => {
    const body = {
        name: req.body.name,
        rank: req.body.rank
    }
    try {
        const category = await Category.create(body)

        res.status(201).json({
            status: true,
            message: "创建分类成功。",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "创建分类失败",
            error: error.message
        })
    }
})
//删除分类
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)
        if (category) {
            const count = await Course.count({ where: { categoryId: req.params.id } })
            if (count > 0) {
                throw new Error('当前分类有课程，无法删除')
            }
            await category.destroy()
            res.json({
                status: true,
                messgae: '删除分类成功'
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "分类未找到"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "删除失败123"
        })
    }
})
//更新分类
router.put("/:id", async (req, res) => {
    try {
        const condition = getCondiction()
        const category = await Category.findByPk(req.params.id, condition)
        if (category) {
            await category.update(req.body)
            res.json({
                status: true,
                messgae: '更新分类成功',
                category
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "分类未找到"
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