'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Course.belongsTo(models.Category, { as: 'category' })
      models.Course.belongsTo(models.User, { as: 'user' })
      models.Course.hasMany(models.Chapter, { as: 'chapter' })
      models.Course.belongsToMany(models.User, { through: models.Like, foreignKey: "courseId", as: "likeUsers" })
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类ID必须填写' },
        notEmpty: { msg: '分类ID不能为空' },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value}的分类不存在。`)
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户ID必须填写' },
        notEmpty: { msg: '用户ID不能为空' },
        async isPresent(value) {
          const user = await sequelize.models.User.findByPk(value)
          if (!user) {
            throw new Error(`ID为：${value}的用户不存在`)
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '课程名称必须填写' },
        notEmpty: { msg: '课程名称不能为空' },
      }
    },
    image: DataTypes.STRING,
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: { msg: '推荐情况必须填写' },
        notEmpty: { msg: '推荐情况不能为空' },
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: { msg: '导读情况必须填写' },
        notEmpty: { msg: '导读情况不能为空' },
      }
    },
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};