/* eslint-disable class-methods-use-this */
import { Piece, LoaderPieceContext, PieceOptions } from "@sapphire/pieces";
import { PrehandlerContainerResult } from "../Lib/Prehandlers/IPrehandlerContainer.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { Route } from "./Route.js";
import { Awaitable } from "@sapphire/utilities";
import { ApiError } from "../Errors/ApiError.js";
import { Result } from "@sapphire/result";

export abstract class PreHandler extends Piece {
    public readonly position: number | null;

    public constructor(context: LoaderPieceContext, options: PrehandlerOptions) {
        super(context, options);
        this.position = options.position ?? null;
    }

    public error(options: { message: string; statusCode: number; type: string }): Awaitable<Result<unknown, ApiError>> {
        return Result.err(new ApiError(options.message, { statusCode: options.statusCode, type: options.type }));
    }

    public ok(): Awaitable<Result<unknown, ApiError>> {
        return Result.ok();
    }


    public abstract run(request: FastifyRequest, reply: FastifyReply, route: Route, context?: PrehandlerContext | undefined): Awaitable<PrehandlerContainerResult>;
}

export interface PrehandlerContext extends Record<PropertyKey, unknown> {
    external?: boolean;
}

export interface PrehandlerOptions extends PieceOptions {
    position?: number;
}

export interface Prehandlers {
    Enabled: never;
}

export interface PrehandlerContext extends Record<PropertyKey, unknown> {
    external?: boolean;
}

export type PrehandlerKeys = keyof Prehandlers;
export type SimplePrehandlerKeys = {
    [K in PrehandlerKeys]: Prehandlers[K] extends never ? K : never;
}[PrehandlerKeys];
