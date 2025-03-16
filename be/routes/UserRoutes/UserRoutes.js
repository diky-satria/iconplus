const {
  getUser,
  detailUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/UserController/UserController.js");
const VerifyUser = require("../../middleware/VerifyUser.js");
const {
  createUserVal,
  updateUserVal,
} = require("../../validation/userValidation/UserValidation.js");
let router = require("express").Router();

router.get("/user", VerifyUser, getUser);
router.get("/user/:id", VerifyUser, detailUser);
router.post("/user", VerifyUser, createUserVal, createUser);
router.patch("/user/:id", VerifyUser, updateUserVal, updateUser);
router.delete("/user/:id", VerifyUser, deleteUser);

module.exports = router;
