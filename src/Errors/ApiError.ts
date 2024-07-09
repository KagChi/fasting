export interface ApiErrorOptions {
    statusCode?: number;
    type: string;
}

export class ApiError extends Error {
    public statusCode?: number;
    public type: string;

    public constructor(message: string, options?: ApiErrorOptions) {
        super(message);
        this.message = message;
        this.name = "ApiError";

        this.statusCode = options?.statusCode;
        this.type = options?.type ?? "UnknownError";
    }
}
