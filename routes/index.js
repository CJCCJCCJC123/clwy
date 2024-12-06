const express = require("express")
const router = express.Router()
const { Op } = require("sequelize")
const { User, Course, Category, Chapter, Article, Setting } = require("../models")
const bcript = require('bcryptjs')
const jwt = require("jsonwebtoken")
//查询课程
router.get('/course', async (req, res) => {
  try {
    //推荐课程
    const conditionRed = {
      arrtibutes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Category,
          as: "category",
          attributes: ['id', 'name']
        }
      ],
      where: {
        recommended: 1
      }
    }
    const coursesRed = await Course.findAll(conditionRed)
    //人气课程
    const conditionLike = {
      arrtibutes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Category,
          as: "category",
          attributes: ['id', 'name']
        }
      ],
      order: [["likesCount", "desc"], ["id", "asc"]],
      limit: 10
    }
    const coursesLike = await Course.findAll(conditionLike)
    //入门课程
    const conditionIntro = {
      arrtibutes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Category,
          as: "category",
          attributes: ['id', 'name']
        }
      ],
      where: {
        introductory: true
      }
    }
    const coursesIntro = await Course.findAll(conditionIntro)
    res.json({
      status: true,
      msg: "查询成功",
      data: {
        coursesRed,
        coursesLike,
        coursesIntro
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//查询分类
router.get('/category', async (req, res) => {
  try {
    const condition = {
      order: [['rank', 'asc'], ['id', 'asc']]
    }
    const category = await Category.findAll(condition)
    res.json({
      status: true,
      msg: "查询成功",
      data: category
    })
  } catch (error) {
    res.json({
      status: false,
      msg: error.message
    })
  }
})
//查询课程by分类
router.get('/coursebyCategory', async (req, res) => {
  try {
    if (!req.query.categoryId) throw new Error("无分类id")
    const condition = {
      arrtibutes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Category,
          as: "category",
          attributes: ['id', 'name']
        }
      ],
      where: {
        categoryId: req.query.categoryId
      }
    }
    const courses = await Course.findAll(condition)
    res.json({
      status: true,
      msg: "查询成功",
      data: courses
    })
  } catch (error) {
    res.json({
      status: false,
      msg: error.message
    })
  }
})
//查询课程详情
router.get('/course/:id', async (req, res) => {
  try {
    const courseId = req.params.id
    if (!courseId) throw new Error("无课程id")
    const condition = {
      arrtibutes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Category,
          as: "category",
          attributes: ['id', 'name']
        },
        {
          model: Chapter,
          as: "chapter",
          attributes: [id, title, content, video, rank]
        }
      ],
    }
    const course = await Course.findByPk(courseId, condition)
    res.json({
      status: true,
      msg: "查询成功",
      data: course
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//模糊搜索文章
router.get('/search', async (req, res) => {
  try {
    const query = req.query
    if (!query.name) throw new Error("请输入关键词")
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const condition = {
      order: [["createdAt", "desc"]],
      limit: pageSize,
      offset
    }

    condition.where = {
      name: {
        [Op.like]: `%${query.name}%`
      }
    }

    const { count, rows } = await Course.findAndCountAll(condition)
    res.json({
      status: true,
      message: "查询成功",
      data: {
        courses: rows,
        pageination: {
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
//查询章节
router.get('/chapter/:id', async (req, res) => {
  try {
    // const condition = {
    //   include: [
    //     {
    //       model: Course,
    //       as: "course",
    //       attributes: ["id", "userId", "name"],
    //       include: [
    //         {
    //           model: User,
    //           as: "user",
    //           attributes: ["id", "nickname", "username", "avatar"]
    //         }
    //       ]
    //     }
    //   ]
    // }
    const chapter = await Chapter.findByPk(req.params.id, { attributes: { exclude: ['CourseId'] } })
    const course = await chapter.getCourse({ attributes: ["id", "userId", "name"] })
    const user = await course.getUser({ attributes: ["id", "nickname", "username", "avatar"] })
    const chapters = await Chapter.findAll({
      where: {
        courseId: chapter.courseId
      }
    })
    res.json({
      status: true,
      msg: "查询成功",
      data: {
        chapter, course, user, chapters
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//查询文章
router.get('/article', async (req, res) => {
  try {
    if (req.query.id) {
      const article = await Article.findByPk(req.query.id)
      if (article) {
        res.json({
          status: true,
          msg: "查询成功",
          data: article
        })
      } else {
        throw new Error("未找到结果")
      }
    } else {
      const condition = {
        order: [['createdAt', 'desc']]
      }
      const article = await Article.findAll(condition)
      res.json({
        status: true,
        msg: "查询成功",
        data: article
      })
    }

  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//查询设置信息
router.get('/setting', async (req, res) => {
  try {
    const setting = await Setting.findOne()
    if (setting) {
      res.json({
        status: true,
        msg: "查询成功",
        data: setting
      })
    } else {
      throw new Error("查询设置信息失败")
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//注册用户
router.post('/register', async (req, res) => {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: 0,
      nickname: req.body.nickname,
      sex: 1
    }
    const user = await User.create(body)
    delete user.dataValues.password
    res.json({
      status: true,
      msg: "创建用户成功",
      data: user
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message
    })
  }
})
//用户登录
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body
    console.log(req.body)
    console.log(login, password)
    if (!login) throw new Error("必须输入用户名或邮箱")
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: login }, { username: login }
        ]
      }
    })
    if (!user) throw new Error("用户不存在")
    if (!bcript.compareSync(password, user.password)) throw new Error("密码错误")
    const token = jwt.sign({ userId: user.id }, process.env.secret, { expiresIn: "1h" })
    res.json({
      status: true,
      msg: "登录成功",
      data: token
    })
  } catch (error) {
    res.status(500).json({
      status: true,
      msg: error.message
    })
  }
})
module.exports = router