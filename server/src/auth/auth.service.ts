import {CreateUserDto} from "./dto/create-user.dto";
import jwt from "jsonwebtoken"
import {InvalidUsername, UserDoesNotExist, UserAlreadyExists} from "./auth.errors";
import {AuthRepository} from "./auth.repository";
import {User} from "../entities/User";

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

        const {username, phone_number} = dto

        // check if user already exists:
        const user: User = await this.authRepository.getByNumber(phone_number)
        if (user){
            throw new UserAlreadyExists()
        }

        // create user:
        return this.authRepository.register(dto)

    }

    async login(dto: CreateUserDto): Promise<number>{

        const {username, phone_number} = dto

        // checking whether the auth exist by phone number:

        const user: User = await this.authRepository.getByNumber(phone_number)
        if (!user){
            throw new UserDoesNotExist()
        }

        // check for correct username:
        if (username !== user.username){
            throw new InvalidUsername()
        }

        return user.id
    }

}