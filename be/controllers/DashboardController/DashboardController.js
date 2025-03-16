const { sequelize } = require("../../models/index.js");
const { QueryTypes, where } = require("sequelize");
const { validationResult } = require("express-validator");
const dayjs = require("dayjs");

exports.getDashboard = async (req, res) => {
  try {
    // KELOMPOKAN ADA BERAPA BULAN DAN TAHUN
    let data = await sequelize.query(
      `SELECT DISTINCT DATE_FORMAT(tanggal, '%Y-%m') AS periode
FROM meetings WHERE is_deleted = 0
ORDER BY periode DESC;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // AMBIL UNIT DARI SETIAP BULAN DAN TAHUN
    for (let i = 0; i < data.length; i++) {
      let bulan = data[i].periode;
      let unit = await sequelize.query(
        `SELECT nama_unit as officeName FROM meetings WHERE is_deleted = 0 AND DATE_FORMAT(tanggal, '%Y-%m') = '${bulan}' group by nama_unit;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      data[i].data = unit;
    }

    // AMBIL RUANGAN DARI SETIAP BULAN DAN TAHUN
    for (let j = 0; j < data.length; j++) {
      let ruangan = data[j].data;
      let bulan_ruangan = data[j].periode;
      for (let k = 0; k < ruangan.length; k++) {
        let nama_ruangan = ruangan[k].officeName;
        let data_ruangan = await sequelize.query(
          `SELECT nama_ruangan as roomName, kapasitas as capacity FROM meetings WHERE is_deleted = 0 AND DATE_FORMAT(tanggal, '%Y-%m') = '${bulan_ruangan}' AND nama_unit = '${nama_ruangan}' group by nama_ruangan, kapasitas;`,
          {
            type: QueryTypes.SELECT,
          }
        );
        ruangan[k].detailSummary = data_ruangan;
      }
    }

    // CARI DATA PERSENTASI RUANGAN DIPAKAI SETIAP BULAN DAN TAHUN
    for (let l = 0; l < data.length; l++) {
      let ruangan = data[l].data;
      let bulan_ruangan = data[l].periode;
      let totalHariDalamBulan = dayjs(bulan_ruangan, "YYYY-MM").daysInMonth();
      for (let m = 0; m < ruangan.length; m++) {
        let nama_ruangan = ruangan[m].officeName;
        let detail_ruangan = ruangan[m].detailSummary;
        for (let n = 0; n < detail_ruangan.length; n++) {
          let data_detail_ruangan = await sequelize.query(
            `SELECT count(id) as total FROM meetings WHERE is_deleted = 0 AND DATE_FORMAT(tanggal, '%Y-%m') = '${bulan_ruangan}' AND nama_unit = '${nama_ruangan}' AND nama_ruangan = '${detail_ruangan[n].roomName}'`,
            {
              type: QueryTypes.SELECT,
            }
          );
          let totalMeetings = data_detail_ruangan[0].total;
          let rataRataPerHari = Math.floor(totalMeetings / totalHariDalamBulan);

          detail_ruangan[n].averageOccupancyPerMonth = rataRataPerHari;

          // CARI DATA KONSUMSI
          let list_data = await sequelize.query(
            `SELECT * FROM meetings WHERE is_deleted = 0 AND DATE_FORMAT(tanggal, '%Y-%m') = '${bulan_ruangan}' AND nama_unit = '${nama_ruangan}' AND nama_ruangan = '${detail_ruangan[n].roomName}'`,
            {
              type: QueryTypes.SELECT,
            }
          );
          let totalConsumption = [
            {
              name: "Snack Siang",
              totalPackage: 0,
              totalPrice: 0,
            },
            {
              name: "Makan Siang",
              totalPackage: 0,
              totalPrice: 0,
            },
            {
              name: "Snack Sore",
              totalPackage: 0,
              totalPrice: 0,
            },
          ];
          for (let o = 0; o < list_data.length; o++) {
            let konsumsi = await sequelize.query(
              `SELECT * FROM konsums WHERE meeting_id = '${list_data[o].id}'`,
              {
                type: QueryTypes.SELECT,
              }
            );
            for (let p = 0; p < konsumsi.length; p++) {
              if (konsumsi[p].label === "Snack Siang") {
                totalConsumption[0].totalPackage += list_data[o].jumlah_peserta;
                totalConsumption[0].totalPrice +=
                  konsumsi[p].harga * list_data[o].jumlah_peserta;
              } else if (konsumsi[p].label === "Makan Siang") {
                totalConsumption[1].totalPackage += list_data[o].jumlah_peserta;
                totalConsumption[1].totalPrice +=
                  konsumsi[p].harga * list_data[o].jumlah_peserta;
              } else if (konsumsi[p].label === "Snack Sore") {
                totalConsumption[2].totalPackage += list_data[o].jumlah_peserta;
                totalConsumption[2].totalPrice +=
                  konsumsi[p].harga * list_data[o].jumlah_peserta;
              }
            }
          }
          detail_ruangan[n].totalConsumption = totalConsumption;
        }
      }
    }

    return res.status(200).json({
      status: 200,
      msg: "Data dashboard",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: err.message,
    });
  }
};
