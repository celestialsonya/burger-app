import {Request, Response} from "express";
import {CreateUserDto} from "./dto/create-user.dto";
import {AuthService} from "./auth.service";
import client from "../db";
import {validationResult} from "express-validator";
import {CartService} from "../cart/cart.service"
import {InvalidUsername, UserAlreadyExists, UserDoesNotExist} from "./auth.errors";

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
        if (!errors.isEmpty()){
            const message = errors.array()[0].msg
            return res.status(400).send(`Ошибка регистрации: ${message}`)
        }

        const dto: CreateUserDto = req.body

        try {

            const id = await this.authService.register(dto)
            const cartId = await this.cartService.createCart(id)
            const token = this.authService.generateAccessToken(id, cartId)

            return res.status(201).send({id, cartId, token})

        } catch (e){
            console.log(e)
            if (e instanceof UserAlreadyExists){
                return res.status(e.statusCode).send(e.message)
            }

            return res.status(400).send("bad request!!")
        }

    }

    async login(req: Request, res: Response) {

        const dto: CreateUserDto = req.body

        try {

            const id = await this.authService.login(dto)
            const cartId = await this.cartService.getCart(id)
            const token = this.authService.generateAccessToken(id, cartId)

            return res.status(200).send({id, cartId, token})

        } catch (e){
            console.log(e)
            if (e instanceof UserDoesNotExist){
                return res.status(e.statusCode).send(e.message)
            }
            if (e instanceof InvalidUsername){
                return res.status(e.statusCode).send(e.message)
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
