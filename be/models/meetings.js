"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class meetings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  meetings.init(
    {
      id_unit: DataTypes.INTEGER,
      nama_unit: DataTypes.STRING,
      id_ruangan: DataTypes.INTEGER,
      nama_ruangan: DataTypes.STRING,
      kapasitas: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      waktu_mulai: DataTypes.STRING,
      waktu_selesai: DataTypes.STRING,
      jumlah_peserta: DataTypes.INTEGER,
      nominal: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      is_deleted: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "meetings",
    }
  );
  return meetings;
};
