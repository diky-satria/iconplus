const { signIn, signUp } = require("../controllers/AuthController.js");
let router = require("express").Router();

const { signInVal, signUpVal } = require("../validation/AuthVal.js");

router.post("/auth/signin", signInVal, signIn);
router.post("/auth/signup", signUpVal, signUp);

module.exports = router;
