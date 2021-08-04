const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password:"sql1208",
    host: "localhost",
    port: 5432,
    database: "foodfy"
})