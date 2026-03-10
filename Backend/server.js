require("dotenv").config()
const app = require("../Backend/src/app.js")
const connectDB = require("../Backend/src/config/database.js")

//* database connection
connectDB()

const PORT = 3000

app.listen(PORT, () => {
    console.log("Server is running on Port 3000")
})