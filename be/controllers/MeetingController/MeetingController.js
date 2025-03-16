const { sequelize } = require("../../models/index.js");
const { QueryTypes, where } = require("sequelize");
const { validationResult } = require("express-validator");

exports.getMeeting = async (req, res) => {
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
      ? `WHERE is_deleted = 0 AND nama_unit LIKE '%${search}%' OR nama_ruangan LIKE '%${search}%' OR tanggal LIKE '%${search}%' OR waktu_mulai LIKE '%${search}%' OR waktu_selesai LIKE '%${search}%' OR kapasitas LIKE '%${search}%' OR jumlah_peserta LIKE '%${search}%' OR nominal LIKE '%${search}%'`
      : "WHERE is_deleted = 0";
    let offset = (page - 1) * limit;

    let total = await sequelize.query(
      `SELECT count(*) as total FROM meetings ${search_db}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    let total_page = Math.ceil(total[0].total / limit);

    let data = await sequelize.query(
      `SELECT id, nama_unit, nama_ruangan, tanggal, waktu_mulai, waktu_selesai, kapasitas, jumlah_peserta, nominal, is_deleted FROM meetings ${search_db}
         order by id desc limit ${offset},${limit}`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      status: 200,
      msg: "Semua data meeting",
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

exports.detailMeeting = async (req, res) => {
  try {
    // REQUEST  PARAMS
    const { id } = req.params;

    // CHECK MEETING AVAILABLE OR NOT
    const meeting = await sequelize.query(
      `SELECT * FROM meetings WHERE id = '${id}' AND is_deleted = 0`,
      { type: QueryTypes.SELECT }
    );
    if (meeting.length <= 0) {
      return res.status(400).json({
        status: 400,
        message: "Data meeting tidak ditemukan",
      });
    }

    // CHECK KONSUMSI AVAILABLE OR NOT
    const konsumsi = await sequelize.query(
      `SELECT * FROM konsums WHERE meeting_id = '${meeting[0].id}'`,
      { type: QueryTypes.SELECT }
    );

    // RESPONSE
    return res.status(200).json({
      status: 200,
      msg: "Detail data meeting",
      data: meeting[0],
      data_konsumsi: konsumsi,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};

exports.createMeeting = async (req, res) => {
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
        id_unit,
        nama_unit,
        id_ruangan,
        nama_ruangan,
        kapasitas,
        tanggal,
        waktu_mulai,
        waktu_selesai,
        jumlah_peserta,
        konsumsi,
        nominal,
      } = req.body;

      // SAVE TO DATABASE
      const response = await sequelize.models.meetings.create({
        id_unit: id_unit,
        nama_unit: nama_unit,
        id_ruangan: id_ruangan,
        nama_ruangan: nama_ruangan,
        kapasitas: kapasitas,
        tanggal: tanggal,
        waktu_mulai: waktu_mulai,
        waktu_selesai: waktu_selesai,
        jumlah_peserta: jumlah_peserta,
        nominal: nominal,
        created_by: req.userLogin.id,
      });

      // SAVE KONSUMSI
      if (konsumsi.length > 0) {
        for (let i = 0; i < konsumsi.length; i++) {
          await sequelize.models.konsums.create({
            meeting_id: response.id,
            value: konsumsi[i].value,
            label: konsumsi[i].label,
            harga: konsumsi[i].harga,
          });
        }
      }

      // RESPONSE
      return res.status(200).json({
        status: 200,
        msg: "Meeting berhasil ditambahkan",
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

exports.updateMeeting = async (req, res) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      status: 422,
      errors: errors.array()[0],
    });
  } else {
    try {
      // REQUEST BODY AND PARAMS
      const { id } = req.params;
      const {
        id_unit,
        nama_unit,
        id_ruangan,
        nama_ruangan,
        kapasitas,
        tanggal,
        waktu_mulai,
        waktu_selesai,
        jumlah_peserta,
        konsumsi,
        nominal,
      } = req.body;

      // SAVE TO DATABASE
      const response = await sequelize.models.meetings.update(
        {
          id_unit: id_unit,
          nama_unit: nama_unit,
          id_ruangan: id_ruangan,
          nama_ruangan: nama_ruangan,
          kapasitas: kapasitas,
          tanggal: tanggal,
          waktu_mulai: waktu_mulai,
          waktu_selesai: waktu_selesai,
          jumlah_peserta: jumlah_peserta,
          nominal: nominal,
          created_by: req.userLogin.id,
        },
        {
          where: {
            id: id,
          },
        }
      );

      // SAVE KONSUMSI
      if (konsumsi.length > 0) {
        await sequelize.models.konsums.destroy({
          where: {
            meeting_id: id,
          },
        });

        for (let i = 0; i < konsumsi.length; i++) {
          await sequelize.models.konsums.create({
            meeting_id: id,
            value: konsumsi[i].value,
            label: konsumsi[i].label,
            harga: konsumsi[i].harga,
          });
        }
      }

      // RESPONSE
      return res.status(200).json({
        status: 200,
        msg: "Meeting berhasil diedit",
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

exports.deleteMeeting = async (req, res) => {
  try {
    // REQUEST  PARAMS
    const { id } = req.params;

    // CHECK MEETING AVAILABLE OR NOT
    const meeting = await sequelize.query(
      `SELECT id FROM meetings WHERE id = '${id}'`,
      { type: QueryTypes.SELECT }
    );
    if (meeting.length <= 0) {
      return res.status(400).json({
        status: 400,
        message: "Data meeting tidak ditemukan",
      });
    }

    // SAVE TO DATABASE
    const response = await sequelize.models.meetings.update(
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
      msg: "Data meeting berhasil di hapus",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};
