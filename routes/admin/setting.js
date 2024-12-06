const express = require("express")
const router = express.Router()

const { Setting } = require('../../models')

//查询设置
router.get('/', async (req, res) => {
    try {
        const setting = await Setting.findOne()
        res.json({
            status: true,
            message: "查询成功",
            setting
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message,
            setting: ""
        })
    }
})
//更新设置
router.put("/", async (req, res) => {
    try {
        const setting = await Setting.findOne()
        if (setting) {
            await setting.update(req.body)
            res.json({
                status: true,
                messgae: '更新设置成功',
                setting
            })
        } else {
            res.status(404).json({
                statsu: false,
                message: "设置未找到"
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