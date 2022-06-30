import {Client} from "pg";

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "shop",
    port: 5432,
    password: "admin"
})

client.connect()

export default client