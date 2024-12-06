'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let course1 = []
    let course2 = []
    const count = 10
    for (let i = 0; i < count; i++) {
      let charpter1 = {
        title: "CSS学习-章节" + i,
        rank: i,
        courseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      let charpter2 = {
        title: "node学习-章节" + i,
        rank: i,
        courseId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      course1.push(charpter1)
      course2.push(charpter2)
    }
    await queryInterface.bulkInsert('Chapters', [...course1, ...course2], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapters', null, {});
  }
};
