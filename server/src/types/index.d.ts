export {};

declare global {
    namespace Express {
        interface Request {
            userData: any;
        }
    }
}