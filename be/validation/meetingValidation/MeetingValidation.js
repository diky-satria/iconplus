const { body } = require("express-validator");

exports.createMeetingVal = [
  body("id_unit").notEmpty().withMessage("Unit harus di pilih"),
  body("nama_unit").notEmpty().withMessage("Nama unit harus di isi"),
  body("id_ruangan").notEmpty().withMessage("Ruangan harus di pilih"),
  body("nama_ruangan").notEmpty().withMessage("Nama ruangan harus di isi"),
  body("tanggal").notEmpty().withMessage("Tanggal harus di pilih"),
  body("waktu_mulai").notEmpty().withMessage("Waktu mulai harus di pilih"),
  body("waktu_selesai").notEmpty().withMessage("Waktu selesai harus di pilih"),
];

exports.updateMeetingVal = [
  body("id_unit").notEmpty().withMessage("Unit harus di pilih"),
  body("nama_unit").notEmpty().withMessage("Nama unit harus di isi"),
  body("id_ruangan").notEmpty().withMessage("Ruangan harus di pilih"),
  body("nama_ruangan").notEmpty().withMessage("Nama ruangan harus di isi"),
  body("tanggal").notEmpty().withMessage("Tanggal harus di pilih"),
  body("waktu_mulai").notEmpty().withMessage("Waktu mulai harus di pilih"),
  body("waktu_selesai").notEmpty().withMessage("Waktu selesai harus di pilih"),
];
