import {Request, Response} from "express";
import {CreateUserDto} from "./dto/create-user.dto";
import {AuthService} from "./auth.service";
import db from "../db";
import client from "../db";
import {Result, validationResult} from "express-validator";
import jwt from "jsonwebtoken";

require('dotenv').config()
import {CartService} from "../cart/cart.service";


export class AuthController {

    private authService: AuthService
    private cartService: CartService

    constructor(authService: AuthService, cartService: CartService) {
        this.authService = authService
        this.cartService = cartService
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
    }

    async register(req: Request, res: Response){
        const errors = validationResult(req)
        const dto: CreateUserDto = req.body
        try {
            if (!errors.isEmpty()){
                throw new Error("validation") // see catch
            }
            const ok = await this.authService.isLoginTaken(dto.login)
            if (!ok){
                return res.status(400).send("Пользователь с таким именем уже существует")
            }

            const id = await this.authService.register(dto)
            const cartId = await this.cartService.createCart(id)
            const token = this.authService.generateAccessToken(id, cartId)

            return res.status(201).send({id, cartId, token})

        } catch (e: any){
            console.log(e)
            const msg = e.message
            if(msg === "validation"){
                const message = errors.array()[0].msg
                return res.status(400).send(`Ошибка регистрации: ${message}`)
            }
            return res.status(400).send("bad request!!")
        }

    }

    async login(req: Request, res: Response) {
        const body: CreateUserDto = req.body

        try {

            const id = await this.authService.login(body)
            if (!id){
                return res.status(400).send("Пользователь не найден")
            }

            const sql = "select password from users where id = $1"
            const values = [id]

            const {rows} = await client.query(sql, values)
            const {password} = rows[0]

            if (password != body.password){
                return res.status(400).send("Неверный пароль")
            }

            const cartId = await this.cartService.getCart(id)

            const token = this.authService.generateAccessToken(id, cartId)
            return res.status(200).send({id, cartId, token})

        } catch (e){
            console.log(e)
            return res.status(400).send("bad request!!")
        }
    }

    async getUsers(req: Request, res: Response){

        const sql = "select * from users"
        const {rows} = await client.query(sql)

        return res.send({rows})
    }
}