import { Store } from "@sapphire/pieces";
import { PreHandler, PrehandlerContext } from "./PreHandler.js";
import { Result } from "@sapphire/result";
import { FastifyRequest, FastifyReply } from "fastify";
import { Route } from "./Route.js";
import { ApiError } from "../Errors/ApiError.js";

export class PreHandlerStore extends Store<PreHandler> {
    private readonly globalPrehandlers: PreHandler[] = [];
    public constructor() {
        super(PreHandler, { name: "pre-handlers" });
    }

    public async run(request: FastifyRequest, reply: FastifyReply, route: Route, context?: PrehandlerContext | undefined): Promise<Result<unknown, ApiError>> {
        for (const prehandler of this.globalPrehandlers) {
            const result = await prehandler.run(request, reply, route, context);

            if (result.isErr()) {
                return result;
            }
        }

        return Result.ok();
    }

    public override set(key: string, value: PreHandler): this {
        if (value.position !== null) {
            const index = this.globalPrehandlers.findIndex(prehandler => prehandler.position! >= value.position!);

            if (index === -1) this.globalPrehandlers.push(value);
            else this.globalPrehandlers.splice(index, 0, value);
        }

        return super.set(key, value);
    }

    public override delete(key: string): boolean {
        const index = this.globalPrehandlers.findIndex(prehandler => prehandler.name === key);

        if (index !== -1) this.globalPrehandlers.splice(index, 1);

        return super.delete(key);
    }

    public override clear(): void {
        this.globalPrehandlers.length = 0;
        return super.clear();
    }
}
