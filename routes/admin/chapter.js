const express = require("express")
const router = express.Router()

const { Chapter, Course } = require('../../models')
const { Op } = require('sequelize')

//查询所有章节
function getCondiction() {
    return {
        attributes: { exclude: ['CourseId'] },
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'name']
            }
        ],
    }
}
router.get('/', async (req, res) => {
    try {
        if (!req.query.courseId) throw new Error("请传入课程id")
        const currentPage = Math.abs(req.query.currentPage) || 1
        const pageSize = Math.abs(req.res.pageSize) || 10
        const offset = pageSize * (currentPage - 1)

        const condiction = {
            ...getCondiction(),
            order: [["id", "ASC"], ['rank', 'ASC']],
            limit: pageSize,
            offset
        }
        condiction.where = {}
        if (req.query.courseId) {
            condiction.where.courseId = {
                [Op.eq]: req.query.courseId
            }
        }
        if (req.query.title) {
            condiction.where.title = {
                [Op.like]: `%${req.query.title}%`
            }
        }
        const { count, rows: row } = await Chapter.findAndCountAll(condiction)
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
        res.status(500).json({
            status: false,
            message: error.message,
            data: ""
        })
    }
})
//按照id查询章节
router.get('/:id', async (req, res) => {
    try {
        const condiction = {
            ...getCondiction()
        }
        const id = req.params.id
        const chapter = await Chapter.findByPk(id, condiction)
        if (!chapter) {
            return res.status(404).json({
                status: false,
                message: "不存在",
                data: chapter
            })
        }
        return res.json({
            status: true,
            message: "查询成功",
            data: chapter
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: ""
        })
    }
})
//新建章节
router.post("/", async (req, res) => {
    const body = {
        content: req.body.content,
        title: req.body.title,
        video: req.body.video,
        rank: req.body.rank,
        courseId: req.body.courseId,
    }
    try {
        const chapter = await Chapter.create(body)

        res.status(201).json({
            status: true,
            message: "创建章节成功。",
            data: chapter
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: ""
        })
    }
})

//更新章节
router.put("/:id", async (req, res) => {
    try {
        const chapter = await Chapter.findByPk(req.params.id)
        const body = {
            content: req.body.content,
            title: req.body.title,
            video: req.body.video,
            rank: req.body.rank,
            courseId: req.body.courseId,
        }
        if (chapter) {
            await chapter.update(body)
            res.json({
                status: true,
                messgae: '更新章节成功',
                chapter
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "章节未找到"
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
                message: error.message,
                data: ""
            })
        }

    }
})
module.exports = router