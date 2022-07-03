import {Request, Response} from "express";
import {CreateUserDto} from "./dto/create-user.dto";
import {AuthService} from "./auth.service";

import client from "../db";
import {Result, validationResult} from "express-validator";
import jwt from "jsonwebtoken";

//artem: never use global imports to use dependencies ( use constructor )
import {cartController, cartService} from "../cart/cart.router";

function generateAccessToken(id: number, cartId: any){
    const payload = {id, cartId}
    return jwt.sign(payload, process.env.SECRET , {expiresIn: "1h"} )
}

export class AuthController {


    //artem: inject cartService instead of cartController with constructor
    private authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
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
            const cartId = await cartController.createCart(req, res, id)

            //to service
            const token = generateAccessToken(id, cartId)

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
            const sql = "select password from users where id = $1"
            const values = [id]

            const {rows} = await client.query(sql, values)
            const {password} = rows[0]
            //artem: throw custom error (throw new InvalidPassword()) and catch in catch block
            if (password != body.password){
                return res.status(400).send("Неверный пароль")
            }

            const cartId = await cartController.getCart(req, res, id)
            //artem: move this to authService
            const token = generateAccessToken(id, cartId)

            return res.status(200).send({id, cartId, token})

        } catch (e){
            console.log(e)
            //artem: server should return 500 code (if smth goes wrong on server side)
            //artem: include custom error handler to handle custom error such as - `login is already taken`
            return res.status(400).send("bad request!!")
        }
    }

    async getUsers(req: Request, res: Response){

        const sql = "select * from users"
        const {rows} = await client.query(sql)

        return res.send({rows})
    }
}