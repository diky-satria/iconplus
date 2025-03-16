"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class konsums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  konsums.init(
    {
      meeting_id: DataTypes.INTEGER,
      value: DataTypes.INTEGER,
      label: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "konsums",
    }
  );
  return konsums;
};
