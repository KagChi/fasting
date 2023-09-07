import { FastifyReply, FastifyRequest } from "fastify";
import { Route } from "../../../Stores/Route.js";
import { IPrehandlerContainer, PrehandlerContainerReturn } from "../IPrehandlerContainer.js";
import { PrehandlerContext } from "../../../Stores/PreHandler.js";

export interface IPrehandlerCondition {
    runSequential: (
        request: FastifyRequest,
        reply: FastifyReply,
        route: Route,
        entries: readonly IPrehandlerContainer[],
        context?: PrehandlerContext | undefined
    ) => PrehandlerContainerReturn;

    runParallel: (
        request: FastifyRequest,
        reply: FastifyReply,
        route: Route,
        entries: readonly IPrehandlerContainer[],
        context?: PrehandlerContext | undefined
    ) => PrehandlerContainerReturn;
}
