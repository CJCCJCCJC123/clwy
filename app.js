const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const cors = require('cors')
const adminAuth = require("./middle/auth")
const userAuth = require("./middle/user-auth")

//后台路由
const adminArticleRouter = require('./routes/admin/article')
const adminCategoryRouter = require('./routes/admin/category')
const adminSettingRouter = require('./routes/admin/setting')
const adminUserRouter = require('./routes/admin/user')
const adminCourseRouter = require('./routes/admin/course')
const adminChapterRouter = require('./routes/admin/chapter')
const adminChartRouter = require('./routes/admin/chart')
const adminAuthRouter = require('./routes/admin/auth')
//前台路由
const indexRouter = require('./routes/index');
const userRouter = require("./routes/user")

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//后台路由配置
app.use('/admin/user', adminAuth, adminUserRouter);
app.use('/admin/article', adminAuth, adminArticleRouter)
app.use('/admin/category', adminAuth, adminCategoryRouter)
app.use('/admin/setting', adminAuth, adminSettingRouter)
app.use('/admin/course', adminAuth, adminCourseRouter)
app.use('/admin/chapter', adminAuth, adminChapterRouter)
app.use('/admin/chart', adminAuth, adminChartRouter)
app.use('/admin/auth', adminAuthRouter)
//前台路由配置
app.use('/', indexRouter);
app.use('/auth', userAuth, userRouter)

module.exports = app;
