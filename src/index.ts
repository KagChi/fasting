import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { PreHandlerStore } from "./Stores/PreHandlerStore.js";
import { RouteStore } from "./Stores/RouteStore.js";
import { StoreRegistry, container } from "@sapphire/pieces";
import middie from "@fastify/middie";
import fp from "fastify-plugin";
import { PluginStore } from "./Stores/PluginStore.js";

export * from "./Lib/Prehandlers/PrehandlerContainerArray.js";
export * from "./Lib/Prehandlers/PrehandlerContainerSingle.js";
export * from "./Lib/Prehandlers/IPrehandlerContainer.js";

export * from "./Lib/Prehandlers/Conditions/IPrehandlerCondition.js";
export * from "./Lib/Prehandlers/Conditions/PrehandlerConditionAnd.js";
export * from "./Lib/Prehandlers/Conditions/PrehandlerConditionOr.js";

export * from "./Stores/PreHandler.js";
export * from "./Stores/PreHandlerStore.js";
export * from "./Stores/Route.js";
export * from "./Stores/RouteStore.js";
export * from "./Stores/Plugin.js";
export * from "./Stores/PluginStore.js";

export * from "./Errors/ApiError.js";

export interface FastingOptions extends FastifyPluginOptions {
    paths: string[];
}

const fasting = async (fastify: FastifyInstance, options: FastingOptions): Promise<void> => {
    const stores = container.stores;
    stores.register(new RouteStore());
    stores.register(new PreHandlerStore());

    container.server = fastify;

    for (const path of options.paths) stores.registerPath(path);

    fastify.decorate("fasting-stores", stores);

    await fastify.register(middie);
    await stores.load();
};

export default fp(fasting, {
    fastify: "4.x",
    name: "@kagchi/fasting"
});

export { fasting };

declare module "@sapphire/pieces" {
    interface StoreRegistryEntries {
        routes: RouteStore;
        plugins: PluginStore;
        "pre-handlers": PreHandlerStore;
    }

    interface Container {
        server: FastifyInstance;
    }
}

declare module "fastify" {
    interface FastifyInstance {
        "fasting-stores": StoreRegistry;
    }
}
