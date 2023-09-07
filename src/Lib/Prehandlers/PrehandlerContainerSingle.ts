/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FastifyReply, FastifyRequest } from "fastify";
import { Route } from "../../Stores/Route.js";
import { ApiError } from "../../Errors/ApiError.js";
import { container } from "@sapphire/pieces";
import { Result, err } from "@sapphire/result";
import { PrehandlerContext, PrehandlerKeys, Prehandlers, SimplePrehandlerKeys } from "../../Stores/PreHandler.js";
import { Awaitable } from "@sapphire/utilities";
import { IPrehandlerContainer } from "./IPrehandlerContainer.js";

export interface SimplePrehandlerSingleResolvableDetails {
    name: SimplePrehandlerKeys;
}

export interface PrehandlerSingleResolvableDetails<K extends PrehandlerKeys = PrehandlerKeys> {
    name: K;
    context: Prehandlers[K];
}

export type PrehandlerSingleResolvable = PrehandlerSingleResolvableDetails | SimplePrehandlerKeys | SimplePrehandlerSingleResolvableDetails;

export class PrehandlerContainerSingle implements IPrehandlerContainer {
    public readonly context: Record<PropertyKey, unknown>;
    public readonly name: string;

    public constructor(data: PrehandlerSingleResolvable) {
        if (typeof data === "string") {
            this.name = data;
            this.context = {};
        } else {
            this.context = Reflect.get(data, "context") ?? {};
            this.name = data.name;
        }
    }

    public run(request: FastifyRequest, reply: FastifyReply, route: Route, context?: PrehandlerContext | undefined): Awaitable<Result<unknown, ApiError>> {
        const prehandler = container.stores.get("pre-handlers").get(this.name);
        if (prehandler) {
            return prehandler.run(request, reply, route, { ...context, ...this.context });
        }
        return err(new ApiError(`The prehandler "${this.name}" is not available.`, 500));
    }
}
