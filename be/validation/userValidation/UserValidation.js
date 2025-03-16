const { body } = require("express-validator");
const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");

exports.createUserVal = [
  body("id_unit").notEmpty().withMessage("Unit harus di pilih"),
  body("nama_unit").notEmpty().withMessage("Nama unit harus di isi"),
  body("role").notEmpty().withMessage("Role harus di pilih"),
  body("username")
    .notEmpty()
    .withMessage("Username harus di isi")
    .isLength({ min: 6 })
    .withMessage("Username setidaknya 6 karakter")
    .custom(async (username) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Username sudah terdaftar");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password harus di isi")
    .isLength({ min: 8 })
    .withMessage("Password setidaknya 8 karakter")
    .matches(/[a-z]/)
    .withMessage("Password harus mengandung huruf kecil")
    .matches(/[A-Z]/)
    .withMessage("Password harus mengandung huruf besar")
    .matches(/\d/)
    .withMessage("Password harus mengandung setidaknya 1 angka")
    .matches(/[@$!%*?&#]/)
    .withMessage("Password harus mengandung special karakter"),
  body("konfirmasi_password")
    .notEmpty()
    .withMessage("Konfirmasi password harus di isi")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Konfirmasi password tidak sesuai");
      }
      return true;
    }),
];

exports.updateUserVal = [
  body("username")
    .notEmpty()
    .withMessage("Username harus di isi")
    .custom(async (username, { req }) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (username !== req.body.username_lama && cek.length > 0) {
        throw new Error("Username sudah terdaftar");
      }
      return true;
    }),
  body("role").notEmpty().withMessage("Role harus di pilih"),
  body("id_unit").notEmpty().withMessage("Unit harus di pilih"),
  body("nama_unit").notEmpty().withMessage("Nama unit harus di isi"),
];
