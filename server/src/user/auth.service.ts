import {CreateUserDto} from "./dto/create-user.dto";
import client from "../db";
import jwt from "jsonwebtoken"
import {InvalidPassword, UserDoesNotExist} from "../errors/auth.errors";
export class AuthService{
    //artem: inject repository with constructor
    constructor() {

        //artem: dont forget to .bind(this) each method
    }

    generateAccessToken(id: number, cartId: any): string{
        const payload = {id, cartId}
        return jwt.sign(payload, process.env.SECRET , {expiresIn: "1h"} )
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

    async login(dto: CreateUserDto):Promise<number>{
        const {login, password} = dto

        const sql = "select id, password from users where login = $1"
        const values = [login]
        const {rows} = await client.query(sql, values)

        if (!rows.length){
            throw new UserDoesNotExist()
        }
        // chevk password:
        const dbPassword = rows[0].password
        const id = rows[0].id
        //artem: throw custom error (throw new InvalidPassword()) and catch in catch block

        if (password !== dbPassword){
            throw new InvalidPassword();
        }


        return id
    }

}


require("dotenv").config()
