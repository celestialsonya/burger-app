
export class ProductNotFound extends Error{

    constructor() {
        super();
    }
    statusCode = 404
    message: string = "This product not found!!"
}