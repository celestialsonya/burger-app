import client from "../db"
import {Client} from "pg";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "../entities/User";

export class AuthRepository{

    private client: Client
    constructor(db: Client) {
        this.client = db
    }

    async getByNumber(phoneNumber: string): Promise<User | null>{
        const sql = "select * from users where phone_number = $1"
        const values = [phoneNumber]
        const {rows} = await client.query(sql, values)

        if (rows.length > 0){
            return rows[0]
        }

        return null
    }

    async register(dto: CreateUserDto): Promise<number>{

        // create auth and adding to database:

        const sql = "insert into users (username, phone_number) values ($1, $2) returning id"
        const values = [dto.username, dto.phone_number]

        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

}