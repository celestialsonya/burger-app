import {IncorrectUsername, UsernameIsEmpty} from "../auth.errors";

export function Name(username: string): void{

    if (!username.length){
        throw new UsernameIsEmpty()
    }

    const ok = username.split(" ")
    if (ok.length !== 2 || ok[0].length < 2 || ok[1].length < 3){
        throw new IncorrectUsername()
    }

}