import { Piece, PieceContext } from "@sapphire/pieces";
import { HTTPMethods, FastifySchema, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { Awaitable } from "@sapphire/utilities";
import { Result } from "@sapphire/result";
import { ApiError } from "../Errors/ApiError.js";
import { PrehandlerContainerArray, PrehandlerEntryResolvable } from "../Lib/Prehandlers/PrehandlerContainerArray.js";

export abstract class Route extends Piece<RouteOptions> {
    public prehandlers: PrehandlerContainerArray;
    public constructor(context: PieceContext, options: RouteOptions) {
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
                const result = await Result.fromAsync<unknown, ApiError>(() => this.run(req, res));
                if (result.isErr()) {
                    const error = result.unwrapErr();
                    return res.code(error.statusCode ?? 500).send({ statusCode: error.statusCode, message: error.message, cause: error.cause });
                }
                if (result.isOkAnd(value => typeof value === "object")) return result.unwrap();
            },
            preHandler: async (req, res) => {
                const global = await this.container.stores.get("pre-handlers").run(req, res, this);
                if (global.isErr()) {
                    const error = global.unwrapErr();
                    return res.code(error.statusCode ?? 500).send({ statusCode: error.statusCode, message: error.message, cause: error.cause });
                }

                const result = await this.prehandlers.run(req, res, this);
                if (result.isErr()) {
                    const error = result.unwrapErr();
                    return res.code(error.statusCode ?? 500).send({ statusCode: error.statusCode, message: error.message, cause: error.cause });
                }
            },
            schema: this.options.schema
        });

        return super.onLoad();
    }

    public abstract run(request: FastifyRequest, reply: FastifyReply): Awaitable<unknown>;
}

export interface RouteOptions extends Piece.Options, RouteShorthandOptions {
    path: string;
    method: HTTPMethods;
    name?: string;
    schema?: FastifySchema;
    preHandlers?: PrehandlerEntryResolvable[];
}
