const { json } = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         firstname:
 *           type: string
 *         lastname:
 *           type: stringe
 *         profilePic:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         email:
 *           type: string
 *         followers:
 *           type: array
 *         followings:
 *           type: array
 *         isAdmin:
 *           type: boolean
 *         slug:
 *           type: string
 *       example:
 *         firstname: John
 *         lastname: Doe
 *         profilePic: 
 *         username: johndoe
 *         password: 123456
 *         phoneNumber: 08012345678
 *         isAdmin: false
 *         followers: []
 *         followings: []
 *         email: johndoe@gmail.com
 *         slug:
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The user authentication API
*/


/**
 * @swagger
 * /login:
 *  post:
 *    summary: login a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *            example: 
 *              username: joe
 *              password: "123456"
 *    responses:
 *      200:
 *        description: The user has succesfully logged in
 *      404:
 *        description: user not found
 *    
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const checkUser = await User.findOne({ username: username })
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


/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Check the current user's token if valid
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The user is authenticated
 *       401:
 *         description: The user is not authenticated
 *       500:
 *         description: Something went wrong
 */
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


/**
 * @swagger
 * /logout:
 *   get:
 *     summary: logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: This user is logged out
 *       401:
 *         description: The user is not authenticated
 *       500:
 *         description: Something went wrong
 */
const logout = async (req, res) => {
    try {
        // const authorization = req.headers.authorization
        // if (!authorization || !authorization.startsWith("Bearer ")) {
        //     return res.status(401).json({ msg: "No token given" });
        // } else {
        //     const token = authorization.split(" ")[1]
        //     const decoded = jwt.verify(token, process.env.SECRET_KEY)
        //     // const token = "";
            res.status(200).json({msg: "Since Jwt is stateless, logout has to be implemented on the front end" })
        // }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" })
    }
}

module.exports = {
    login,
    auth,
    logout
}