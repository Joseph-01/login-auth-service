const express = require("express")

const router = express.Router()

const {login, auth, logout} = require("../controllers/authController")

router.route("/auth").get(auth)
router.route("/login").post(login)
router.route("/logout").get(logout)

module.exports = router