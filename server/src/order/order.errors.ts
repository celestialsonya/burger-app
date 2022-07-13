
export class SpamOrders extends Error{

    constructor() {
        super();
    }
    statusCode = 505
    message: string = "You cannot create orders more often than" +
        " once every 2 minutes. Please wait and repeat the action."
}