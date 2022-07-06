
export class UserDoesNotExist extends Error{

    constructor() {
        super();
    }
    statusCode = 404
    message: string = "User not found!!"
}

export class InvalidPassword extends Error{

    constructor() {
        super();
    }
    statusCode = 401
    message: string = "Invalid password!!"
}

export class UserAlreadyExists extends Error{

    constructor() {
        super();
    }
    statusCode = 403
    message: string = "User with this name already exist!!"
}