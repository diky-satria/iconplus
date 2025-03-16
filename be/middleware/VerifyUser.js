const jwt = require("jsonwebtoken");
const { sequelize } = require("../models/index.js");
const { QueryTypes } = require("sequelize");
require("dotenv").config();

module.exports = (req, res, next) => {
  const getToken = req.headers["authorization"];
  const token = getToken?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthenticated",
      });
    } else {
      // CHECK USER BASE ON ID
      const getUser = await sequelize.query(
        `SELECT * FROM users WHERE id = '${user.id}'`,
        { type: QueryTypes.SELECT }
      );

      // SET USER LOGIN
      req.userLogin = getUser[0];

      next();
    }
  });
};
