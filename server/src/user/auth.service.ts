import {CreateUserDto} from "./dto/create-user.dto";
import client from "../db";
import jwt from "jsonwebtoken"

export class AuthService{
    //artem: inject repository with constructor
    constructor() {

        //artem: dont forget to .bind(this) each method
    }

    async register(body: CreateUserDto){
        //artem: rename body to dto
        const {login, password} = body
        //artem: use repository to make sql requests
        const sql = "insert into users (login, password) values ($1, $2) returning id"
        const values = [login, password]

        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id
    }

    async login(body: CreateUserDto){
        const {login, password} = body

        const sql = "select id from users where login = $1"
        const values = [login]

        const {rows} = await client.query(sql, values)

        if (!rows.length){
            return
        }

        const {id} = rows[0]

        return id
    }

}