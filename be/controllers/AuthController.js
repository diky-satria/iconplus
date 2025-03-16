const { sequelize } = require("../models/index.js");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      status: 422,
      errors: errors.array()[0],
    });
  } else {
    // CHECK USER BASE ON USERNAME
    var user = await sequelize.query(
      `SELECT * FROM users WHERE username='${req.body.username}'`,
      { type: QueryTypes.SELECT }
    );

    // CHECK USER EXISTS
    if (user.length > 0) {
      const password = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      // CHECK INVALID PASSWORD
      if (password) {
        const user_variable = {
          id: user[0].id,
          username: user[0].username,
          role: user[0].role,
        };
        const token = jwt.sign(user_variable, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // RESPONSE
        return res.status(200).json({
          status: 200,
          msg: "Berhasil login",
          token: token,
          data: user_variable,
        });
      } else {
        return res.status(422).json({
          status: 422,
          errors: {
            msg: "Password salah",
            param: "password",
          },
        });
      }
    } else {
      return res.status(422).json({
        status: 422,
        errors: {
          msg: "Email tidak terdaftar",
          param: "email",
        },
      });
    }
  }
};

exports.signUp = async (req, res) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      status: 422,
      errors: errors.array()[0],
    });
  } else {
    try {
      // REQUEST BODY
      const {
        username,
        role,
        id_unit,
        nama_unit,
        password,
        konfirmasi_password,
      } = req.body;

      // SAVE TO DATABASE
      const encrypt_password = await bcrypt.hash(konfirmasi_password, 10);
      const response = await sequelize.models.users.create({
        username: username,
        password: encrypt_password,
        role: role,
        id_unit: id_unit,
        nama_unit: nama_unit,
      });

      // RESPONSE
      return res.status(200).json({
        status: 200,
        msg: "User berhasil ditambahkan",
        data: response,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: err.message,
      });
    }
  }
};
