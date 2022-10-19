const { json } = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const login = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const checkUser = await User.findOne({ username: username })
        console.log(checkUser)
        if (checkUser === null) {
            res.status(404).json({ msg: "user not found" })
        } else {
            const checkPassword = await bcrypt.compare(password, checkUser.password)
            if (checkPassword) {
                const token = jwt.sign({ username: checkUser.username, id: checkUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
                res.status(200).json({ user: { username: checkUser.username, id: checkUser._id }, token: token })
            } else {
                res.status(401).json({ msg: "wrong username/password" })
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" })
    }
}


const auth = async (req, res) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token given" });
        }
        const token = authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const { id, username } = decoded
        req.user = { id, username }
        res.status(200).json({ user: req.user, authorize: true })
        // res.json({msg: "auth"})
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" })
    }
}

const logout = async (req, res) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token given" });
        }

        const token = authorization.split(" ")[1]
        res.status(200).json({ msg: "logout" })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" })
    }
}

module.exports = {
    login,
    auth
}