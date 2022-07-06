import client from "../db"
import {Client} from "pg";
import {InvalidPassword, UserAlreadyExists, UserDoesNotExist} from "./auth.errors";
import {CreateUserDto} from "./dto/create-user.dto";

export class AuthRepository{

    private client: Client

    constructor(db: Client) {
        this.client = db
    }

    async register(dto: CreateUserDto): Promise<number>{

        // check is there a auth with this name:

        const {login, password} = dto

        const sqlCheck = "select id from users where login = $1"
        const valuesCheck = [login]

        const data = await client.query(sqlCheck, valuesCheck)

        if (data.rows.length){
            throw new UserAlreadyExists()
        }

        // create auth and adding to database:

        const sql = "insert into users (login, password) values ($1, $2) returning id"
        const values = [login, password]

        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id
    }

    async login(dto: CreateUserDto){

        // checking whether the auth exist by login:

        const {login, password} = dto

        const sql = "select id, password from users where login = $1"
        const values = [login]
        const {rows} = await client.query(sql, values)

        if (!rows.length){
            throw new UserDoesNotExist()
        }

        // check is valid password or not:

        const dbPassword = rows[0].password
        const id = rows[0].id

        if (password != dbPassword){
            throw new InvalidPassword()
        }

        return id
    }
}