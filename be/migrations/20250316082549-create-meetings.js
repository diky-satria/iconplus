"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("meetings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_unit: {
        type: Sequelize.INTEGER,
      },
      nama_unit: {
        type: Sequelize.STRING,
      },
      id_ruangan: {
        type: Sequelize.INTEGER,
      },
      nama_ruangan: {
        type: Sequelize.STRING,
      },
      kapasitas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      waktu_mulai: {
        type: Sequelize.STRING,
      },
      waktu_selesai: {
        type: Sequelize.STRING,
      },
      jumlah_peserta: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      nominal: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
      is_deleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("meetings");
  },
};
