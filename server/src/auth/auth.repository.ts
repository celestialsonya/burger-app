import client from "../db"
import {Client} from "pg";
import {InvalidUsername, UserAlreadyExists, UserDoesNotExist} from "./auth.errors";
import {CreateUserDto} from "./dto/create-user.dto";

export class AuthRepository{

    private client: Client

    constructor(db: Client) {
        this.client = db
    }

    async register(dto: CreateUserDto): Promise<number>{

        // check is there a auth with this name:

        const {username, phone_number} = dto

        const sqlCheck = "select id from users where phone_number = $1"
        const valuesCheck = [phone_number]

        const data = await client.query(sqlCheck, valuesCheck)

        if (data.rows.length){
            throw new UserAlreadyExists()
        }

        // create auth and adding to database:

        const sql = "insert into users (username, phone_number) values ($1, $2) returning id"
        const values = [username, phone_number]

        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id
    }

    async login(dto: CreateUserDto){

        // checking whether the auth exist by phone number:

        const {username, phone_number} = dto

        const sql = "select id, username from users where phone_number = $1"
        const values = [phone_number]
        const {rows} = await client.query(sql, values)

        if (!rows.length){
            throw new UserDoesNotExist()
        }

        // check is valid username or not:

        const dbUsername = rows[0].username
        const id = rows[0].id

        if (username != dbUsername){
            throw new InvalidUsername()
        }

        return id
    }
}