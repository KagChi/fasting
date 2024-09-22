import { Store } from "@sapphire/pieces";
import { Route } from "./Route.js";
import { FastifyRequest, FastifyReply } from "fastify";

export class RouteStore extends Store<Route> {
    public constructor(
        public options: {
            errorResponseBuilder?: (req: FastifyRequest, rep: FastifyReply) => unknown;
        }
    ) {
        super(Route, { name: "routes" });
    }
}
