import {Client} from "pg";
require('dotenv').config()

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: 5432,
    password: process.env.DB_PASSWORD
})

client.connect()

console.log("db has connected")
export default client