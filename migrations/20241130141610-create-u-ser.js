'use strict';

const { unique } = require('@tensorflow/tfjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false,
        type: Sequelize.TINYINT.UNSIGNED
      },
      company: {
        allowNull: false,
        type: Sequelize.STRING
      },
      introduce: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      role: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.TINYINT.UNSIGNED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex(
      'Users', {
      fields: ['email'],
      unique: true
    })
    await queryInterface.addIndex(
      'Users', {
      fields: ['username'],
      unique: true
    })
    await queryInterface.addIndex(
      'Users', {
      fields: ['role'],
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('USers');
  }
};