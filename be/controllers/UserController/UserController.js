const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getUser = async (req, res) => {
  try {
    let page = Number(req.query.page) || 0;
    if (page < 1)
      return res
        .status(400)
        .json({ status: 400, message: "page harus lebih besar dari 0" });

    let limit = Number(req.query.limit) || 0;
    if (limit < 1)
      return res
        .status(400)
        .json({ status: 400, message: "limit harus lebih besar dari 0" });

    let search = req.query.search || "";
    let search_db = search
      ? `WHERE is_deleted = 0 AND username LIKE '%${search}%' OR role LIKE '%${search}%' OR nama_unit LIKE '%${search}%'`
      : "WHERE is_deleted = 0";
    let offset = (page - 1) * limit;

    let total = await sequelize.query(
      `SELECT count(*) as total FROM users ${search_db}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    let total_page = Math.ceil(total[0].total / limit);

    let data = await sequelize.query(
      `SELECT id, username, role, nama_unit, is_deleted FROM users ${search_db}
         order by id desc limit ${offset},${limit}`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      status: 200,
      msg: "Semua data user",
      data: {
        rows: data,
        page: page,
        limit: limit,
        total_rows: total[0].total,
        total_page: total_page,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};

exports.detailUser = async (req, res) => {
  try {
    // REQUEST  PARAMS
    const { id } = req.params;

    // CHECK USER AVAILABLE OR NOT
    const user = await sequelize.query(
      `SELECT id, username, role, id_unit, nama_unit FROM users WHERE id = '${id}' AND is_deleted = 0`,
      { type: QueryTypes.SELECT }
    );
    if (user.length <= 0) {
      return res.status(400).json({
        status: 400,
        message: "User tidak ditemukan",
      });
    }

    // RESPONSE
    return res.status(200).json({
      status: 200,
      msg: "Detail user",
      data: user[0],
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
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

exports.updateUser = async (req, res) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      // REQUEST BODY AND PARAMS
      const { id } = req.params;
      const { username, username_lama, role, id_unit, nama_unit } = req.body;

      // CHECK USER AVAILABLE OR NOT
      const user = await sequelize.query(
        `SELECT id FROM users WHERE id = '${id}'`,
        { type: QueryTypes.SELECT }
      );
      if (user.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "User tidak ditemukan",
        });
      }

      // SAVE TO DATABASE
      const response = await sequelize.models.users.update(
        {
          username: username,
          role: role,
          id_unit: id_unit,
          nama_unit: nama_unit,
        },
        {
          where: {
            id: id,
          },
        }
      );

      // RESPONSE
      return res.status(200).json({
        status: 200,
        msg: "User berhasil di update",
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: err.message,
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // REQUEST  PARAMS
    const { id } = req.params;

    // CHECK USER AVAILABLE OR NOT
    const user = await sequelize.query(
      `SELECT id FROM users WHERE id = '${id}'`,
      { type: QueryTypes.SELECT }
    );
    if (user.length <= 0) {
      return res.status(400).json({
        status: 400,
        message: "User tidak ditemukan",
      });
    }

    // SAVE TO DATABASE
    const response = await sequelize.models.users.update(
      {
        is_deleted: 1,
      },
      {
        where: {
          id: id,
        },
      }
    );

    // RESPONSE
    return res.status(200).json({
      status: 200,
      msg: "User berhasil di hapus",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};
