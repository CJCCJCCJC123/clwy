const express = require("express")
const router = express.Router()

const { Course, Category, User } = require('../../models')
const { Op } = require('sequelize')

//查询所有课程
function getCondiction() {
    return {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
            }
        ],
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
        if (req.query.categoryId) {
            condiction.where = {
                categoryId: {
                    [Op.eq]: req.query.categoryId
                }
            }
        }
        if (req.query.userId) {
            condiction.where = {
                userId: {
                    [Op.eq]: req.query.userId
                }
            }
        }
        if (req.query.recommended) {
            condiction.where = {
                recommended: {
                    [Op.eq]: req.query.recommended === 'true'
                }
            }
        }
        if (req.query.introductory) {
            condiction.where = {
                introductory: {
                    [Op.eq]: req.query.introductory === 'true'
                }
            }
        }
        if (req.query.name) {
            condiction.where = {
                name: {
                    [Op.like]: `%${req.query.name}%`
                }
            }
        }
        const { count, rows: row } = await Course.findAndCountAll(condiction)
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
//按照id查询课程
router.get('/:id', async (req, res) => {
    try {
        const condiction = {
            ...getCondiction()
        }
        const id = req.params.id
        const course = await Course.findByPk(id, condiction)
        if (!course) {
            return res.status(404).json({
                status: false,
                message: "不存在",
                data: course
            })
        }
        return res.json({
            status: true,
            message: "查询成功",
            data: course
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "查询失败",
            data: ""
        })
    }
})
//新建课程
router.post("/", async (req, res) => {
    const body = {
        categoryId: req.body.categoryId,
        userId: req.user.id,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
        likesCount: req.body.likesCount,
        chaptersCount: req.body.chaptersCount
    }
    try {
        const course = await Course.create(body)

        res.status(201).json({
            status: true,
            message: "创建课程成功。",
            data: course
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "创建课程失败",
            error: error.message
        })
    }
})

//更新课程
router.put("/:id", async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id)
        const body = {
            categoryId: req.body.categoryId,
            userId: req.body.userId,
            name: req.body.name,
            image: req.body.image,
            recommended: req.body.recommended,
            introductory: req.body.introductory,
            content: req.body.content,
            likesCount: req.body.likesCount,
            chaptersCount: req.body.chaptersCount
        }
        if (course) {
            await course.update(body)
            res.json({
                status: true,
                messgae: '更新课程成功',
                course
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "课程未找到"
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
//删除课程
router.delete("/:id", async (req, res) => {
    try {
        const count = await Chapter.count({ where: { courseId: req.params.id } })
        if (count > 0) throw new Error("当前课程有章节，无法删除")
        await Course.destory()
        res.json({
            status: false,
            messgae: "删除成功"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            messgae: error.message
        })
    }
})
module.exports = router