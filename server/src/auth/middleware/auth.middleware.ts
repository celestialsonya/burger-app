import jwt from "jsonwebtoken";
import {Response} from "express";
require("dotenv").config()

export function AuthMiddleware(req: any, res: Response, next: any){

    const header = req.headers?.authorization
    if (!header){
        return res.status(401).send("provide header!!")
    }

    const token = header.toString().split(" ")[1]

    try{
        const data: any = jwt.verify(token, process.env.SECRET)

        req.userData = {
            userId: data.id,
            cartId: data.cartId
        }

        next()

    } catch (e){
        res.status(401).send("invalid token!!")
    }


}