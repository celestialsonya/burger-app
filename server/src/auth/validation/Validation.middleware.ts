import {Request, Response} from "express";
import {Name} from "./Name";
import {IncorrectPhone, UserAlreadyExists, UsernameIsEmpty} from "../auth.errors";
import {PhoneNumber} from "./Phone.number";

export function ValidationMiddleware(req: Request, res: Response, next: any) {

    const {username, phone_number} = req.body

    try {
        Name(username)
        const ok: boolean = PhoneNumber(phone_number)

        if (!ok){
            throw new IncorrectPhone()
        }

        next()
    } catch (e) {
        console.log(e)
        if (e instanceof UsernameIsEmpty){
            return res.status(e.statusCode).send(e.message)
        }
        if (e instanceof IncorrectPhone){
            return res.status(e.statusCode).send(e.message)
        }

        res.status(401).send("Недопустимый формат имени!!")
    }


}