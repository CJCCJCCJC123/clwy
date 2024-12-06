const express = require('express')
const router = express.Router()
const { sequelize, User } = require('../../models')
const { Op } = require('sequelize')

//统计性别
router.get("/sex", async function (req, res) {
    try {
        const male = await User.count({ where: { sex: 1 } })
        const female = await User.count({ where: { sex: 2 } })
        const unkown = await User.count({ where: { sex: 0 } })
        const data = {
            male, female, unkown
        }
        res.json({
            status: true,
            msg: "查询成功",
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
            data: ""
        })
    }
})
//按月份统计注册人数
router.get("/userbymonth", async function (req, res) {
    try {
        let sqlStr = "SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS value FROM clwy.users GROUP BY month ORDER BY month ASC;"
        const [result] = await sequelize.query(sqlStr)
        res.json({
            status: true,
            msg: "查询成功",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
            data: ""
        })
    }
})
module.exports = router