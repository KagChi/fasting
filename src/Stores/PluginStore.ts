import { Store } from "@sapphire/pieces";
import { Plugin } from "./Plugin.js";
import { FastifyInstance } from "fastify";

export class PluginStore extends Store<Plugin> {
    public constructor() {
        super(Plugin, { name: "plugins" });
    }

    public async run(fastify: FastifyInstance): Promise<void> {
        await Promise.all(this.map(x => x.run(fastify)));
    }
}
