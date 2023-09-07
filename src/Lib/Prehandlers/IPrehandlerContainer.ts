import { Result } from "@sapphire/result";
import { Awaitable } from "@sapphire/utilities";
import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../Errors/ApiError.js";
import { Route } from "../../Stores/Route.js";
import { PrehandlerContext } from "../../Stores/PreHandler.js";

export type PrehandlerContainerResult = Result<unknown, ApiError>;

export type PrehandlerContainerReturn = Awaitable<PrehandlerContainerResult>;

export type AsyncPrehandlerContainerReturn = Promise<PrehandlerContainerResult>;

export interface IPrehandlerContainer {
    run: (request: FastifyRequest, reply: FastifyReply, route: Route, context?: PrehandlerContext | undefined) => PrehandlerContainerReturn;
}
