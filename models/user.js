'use strict';
const {
  Model
} = require('sequelize');
const bcript = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Course, { as: 'courses' })
      models.User.belongsToMany(models.Course, { through: models.Like, foreignKey: "userId", as: "likeCourses" })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '邮箱必须填写' },
        notEmpty: { msg: '邮箱不能为空' },
        isEmail: { msg: '邮箱格式不正确' },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } })
          if (user) {
            throw new Error('邮箱已存在，请直接登录')
          }
        }
      }
    },
    // email: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户名必须填写' },
        notEmpty: { msg: '用户名不能为空' },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } })
          if (user) {
            throw new Error('用户名已存在，请直接登录')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '密码必须填写' },
        notEmpty: { msg: '密码不能为空' }
      },
      set(value) {
        if (value.length > 6 && value.length < 45) {
          this.setDataValue('password', bcript.hashSync(value, 10))
        } else {
          throw new Error('密码长度必须是6 ~ 45之间')
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6, 45], msg: '长度必须是6 ~ 20之间' },
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '性别必须填写' },
        notEmpty: { msg: '性别不能为空' },
        isIn: { args: [[0, 1, 2]], msg: '1男性，2女性，3不选择' }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '角色必须选择' },
        notEmpty: { msg: '角色不能为空' },
        isIn: { args: [[0, 1]], msg: '0普通用户,1管理员' }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '图片地址不正确' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};