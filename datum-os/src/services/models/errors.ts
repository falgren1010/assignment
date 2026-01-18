export abstract class AppError extends Error {
    protected constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "InternalServerError";
    }
}
