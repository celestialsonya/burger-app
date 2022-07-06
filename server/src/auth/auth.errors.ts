
export class UserDoesNotExist extends Error{

    constructor(message: string) {
        super();
        this.message = message
    }
    statusCode = 404
    message: string
}

export class InvalidPassword extends Error{

    constructor(message: string) {
        super();
        this.message = message
    }
    statusCode = 401
    message: string
}

export class UserAlreadyExists extends Error{

    constructor(message: string) {
        super();
        this.message = message
    }
    statusCode = 403
    message: string
}