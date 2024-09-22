import { Piece, LoaderPieceContext } from "@sapphire/pieces";
import { HTTPMethods, FastifySchema, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { Awaitable } from "@sapphire/utilities";
import { Result } from "@sapphire/result";
import { ApiError } from "../Errors/ApiError.js";
import { PrehandlerContainerArray, PrehandlerEntryResolvable } from "../Lib/Prehandlers/PrehandlerContainerArray.js";
import { STATUS_CODES } from "node:http";
import { RouteStore } from "./RouteStore.js";

export abstract class Route extends Piece<RouteOptions> {
    public prehandlers: PrehandlerContainerArray;

    public constructor(context: LoaderPieceContext, options: RouteOptions) {
        super(context, options);
        if (!this.options.name) this.options.name = `${this.options.method} ${this.options.path}`;
        this.prehandlers = new PrehandlerContainerArray(options.preHandlers ?? []);
    }

    public onLoad(): unknown {
        this.container.server.route({
            ...this.options,
            method: this.options.method,
            url: this.options.path,
            handler: async (req, res) => {
                const result = await Result.fromAsync<unknown, Error>(() => this.run(req, res));
                if (result.isErr()) {
                    const error = result.unwrapErr();

                    if (error instanceof ApiError) {
                        const store = this.store as RouteStore;
                        if (store.options.errorResponseBuilder !== undefined) {
                            return store.options.errorResponseBuilder;
                        }

                        return res
                            .code(error.statusCode ?? 500)
                            .header(this.options.headerErrorType ?? "x-error-type", error.type)
                            .send({
                                error: STATUS_CODES[error.statusCode ?? 500] ?? "Unknown Error",
                                statusCode: error.statusCode,
                                message: error.message,
                                cause: error.cause
                            });
                    }

                    return res.send(error);
                }

                if (result.isOkAnd(value => typeof value === "object") && !res.sent) return result.unwrap();
            },
            onRequest: async (req, rep) => {
                const global = await this.container.stores.get("pre-handlers").run(req, rep, this);
                if (global.isErr()) {
                    const error = global.unwrapErr();
                    if (error instanceof ApiError) {
                        const store = this.store as RouteStore;
                        if (store.options.errorResponseBuilder !== undefined) {
                            return store.options.errorResponseBuilder;
                        }

                        return rep
                            .code(error.statusCode ?? 500)
                            .header(this.options.headerErrorType ?? "x-error-type", error.type)
                            .send({
                                error: STATUS_CODES[error.statusCode ?? 500] ?? "Unknown Error",
                                statusCode: error.statusCode,
                                message: error.message,
                                cause: error.cause
                            });
                    }

                    return rep.send(error);
                }

                const result = await this.prehandlers.run(req, rep, this);
                if (result.isErr()) {
                    const error = result.unwrapErr();
                    if (error instanceof ApiError) {
                        const store = this.store as RouteStore;
                        if (store.options.errorResponseBuilder !== undefined) {
                            return store.options.errorResponseBuilder;
                        }

                        return rep
                            .code(error.statusCode ?? 500)
                            .header(this.options.headerErrorType ?? "x-error-type", error.type)
                            .send({
                                error: STATUS_CODES[error.statusCode ?? 500] ?? "Unknown Error",
                                statusCode: error.statusCode,
                                message: error.message,
                                cause: error.cause
                            });
                    }
                    return rep.send(error);
                }
            },
            schema: this.options.schema
        });

        return super.onLoad();
    }

    public abstract run(request: FastifyRequest, reply: FastifyReply): Awaitable<unknown>;
}

export interface RouteOptions extends Piece.Options, Omit<RouteShorthandOptions, "onRequest"> {
    path: string;
    method: HTTPMethods;
    name?: string;
    schema?: FastifySchema;
    preHandlers?: PrehandlerEntryResolvable[];

    headerErrorType?: string;
}
