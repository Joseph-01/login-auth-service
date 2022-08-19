const express = require("express")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 4000

app.get("/test", (req, res) => {
    res.json({msg: "About to make heroku work"})
})

app.listen(port)