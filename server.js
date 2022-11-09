const express = require("express")
require("dotenv").config()
const dbconnection = require("./config/config")
const swaggerUI = require("swagger-ui-express")
const cors = require("cors");
const swaggerDocs = require("swagger-jsdoc")


const app = express()
const port = process.env.PORT || 5000
const authRoute = require("./routes/authRoute")

//swagger options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "login-auth-service",
            version: "0.0.1",
            description: "This is the service for login, logout and authentication"
        },
        servers: [
            {
                // url: "http://localhost:5000"
                url: "https://api-shugr.cyclic.app/"
            }
        ]
    },
    apis: [
        "./controllers/*.js"
    ]
}

const specs = swaggerDocs(options)
app.use(cors())
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

// app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/", authRoute)
app.get("/test", (req, res) => {
    res.json({ msg: "Stop trying to get access the wrong way" })
})

dbconnection.startConnection(app.listen(port))
