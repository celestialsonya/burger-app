
export class UserDoesNotExist extends Error{

    constructor() {
        super();
    }
    statusCode = 404

}

export class InvalidPassword extends Error{

    constructor() {
        super();
    }
    statusCode = 400
}