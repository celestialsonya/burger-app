import {CreateUserDto} from "./dto/create-user.dto";
import client from "../db";
import jwt from "jsonwebtoken"
import {InvalidUsername, UserDoesNotExist, UserAlreadyExists} from "./auth.errors";
import {AuthRepository} from "./auth.repository";

export class AuthService{

    private authRepository: AuthRepository
    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    generateAccessToken(id: number, cartId: any){
        const payload = {id, cartId}
        return jwt.sign(payload, process.env.SECRET , {expiresIn: "1h"} )
    }

    async register(dto: CreateUserDto): Promise<number>{
        return await this.authRepository.register(dto)
    }

    async login(dto: CreateUserDto): Promise<number>{
        return await this.authRepository.login(dto)
    }

}