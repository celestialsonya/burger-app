
export class UserDoesNotExist extends Error{

    constructor() {
        super();
    }
    statusCode = 404
    message: string = "User not found!!"
}

export class InvalidUsername extends Error{

    constructor() {
        super();
    }
    statusCode = 401
    message: string = "Invalid username!!"
}

export class UserAlreadyExists extends Error{

    constructor() {
        super();
    }
    statusCode = 403
    message: string = "User with this phone number already exist!!"
}

export class UsernameIsEmpty extends Error{

    constructor() {
        super();
    }
    statusCode = 401
    message: string = "Username cannot be empty!!"
}

export class IncorrectUsername extends Error{

    constructor() {
        super();
    }
    statusCode = 401
    message: string = "Incorrect username!!"
}

export class IncorrectPhone extends Error{

    constructor() {
        super();
    }
    statusCode = 401
    message: string = "Incorrect phone number!!"
}