const mongoose = require("mongoose")
require("dotenv").config()


const connectionString = process.env.MONGODB

const connection = (connectionString) => {
    mongoose.connect(connectionString)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))
}

const startConnection = async (listenPort) => {
    try {
        await connection(connectionString)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    startConnection
}