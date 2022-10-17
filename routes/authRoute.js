const express = require("express")

const router = express.Router()

const {login, auth} = require("../controllers/authController")

router.route("/auth").get(auth)
router.route("/login").post(login)

module.exports = router