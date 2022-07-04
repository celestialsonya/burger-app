import {Request, Response} from "express";
import {CreateUserDto} from "./dto/create-user.dto";
import {AuthService} from "./auth.service";

import client from "../db";
import {Result, validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import {CartService} from "../cart/cart.service";
import {InvalidPassword, UserDoesNotExist} from "../errors/auth.errors";

export class AuthController {


    //artem: inject cartService instead of cartController with constructor
    private authService: AuthService
    private cartService: CartService


    constructor(authService: AuthService, cartService: CartService) {
        this.authService = authService
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.cartService = cartService
    }

    async register(req: Request, res: Response){

        const errors = validationResult(req)

        if (!errors.isEmpty()){
            const message = errors.array()[0].msg
            return res.status(400).send(`Ошибка регистрации: ${message}`)
        }

        const body: CreateUserDto = req.body
        const {login} = body

        try {
            //{
            //move this to service
            const sql= "select id from users where login = $1"
            const values = [login]

            const {rows} = await client.query(sql, values)
            if (rows.length){
                return res.status(400).send("Пользователь с таким именем уже существует")
            }
            //}
            const id = await this.authService.register(body)

            //artem: never use global imports. Inject cartService. Delete method `createCart` from cartController
            const cartId = await this.cartService.createCart(id)

            //to service
            const token = this.authService.generateAccessToken(id, cartId)

            return res.status(201).send({id, cartId, token})

        } catch (e){
            console.log(e)
            return res.status(400).send("bad request!!")
        }

    }

    async login(req: Request, res: Response) {
        const body: CreateUserDto = req.body

        try {
            //login should check password. Not controller. Do 2 sql requests, not a problem
            const id = await this.authService.login(body)
            if (!id){
                return res.status(400).send("Пользователь не найден")
            }
            //artem: move this to service -> repository (into login method)

            const cartId = await this.cartService.getCart(id)
            //artem: move this to authService
            const token = this.authService.generateAccessToken(id, cartId)

            return res.status(200).send({id, cartId, token})

        } catch (e){
            console.log(e)
            if(e instanceof InvalidPassword){
                return res.status(e.statusCode).send("Invalid password")
            }
            if(e instanceof UserDoesNotExist){
                return res.status(e.statusCode).send("User not found")
            }

            return res.status(500).end()
        }
    }

    async getUsers(req: Request, res: Response){

        const sql = "select * from users"
        const {rows} = await client.query(sql)

        return res.send({rows})
    }
}