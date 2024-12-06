'use strict';

const bcript = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ptUser = []
    const counts = 100;

    for (let i = 1; i <= counts; i++) {
      const user = {
        email: i + '1832375129@qq.com',
        username: i + '1832375129',
        password: bcript.hashSync('150079cjc!', 10),
        nickname: '普通用户',
        sex: 1,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ptUser.push(user)
    }

    await queryInterface.bulkInsert('Users', [
      {
        email: '1832375129@qq.com',
        username: '1832375129',
        password: bcript.hashSync('150079cjc!', 10),
        nickname: '普通用户',
        sex: 1,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }, ...ptUser], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
