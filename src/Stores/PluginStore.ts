import { Store } from "@sapphire/pieces";
import { Plugin } from "./Plugin.js";

export class PluginStore extends Store<Plugin> {
    public constructor() {
        super(Plugin, { name: "plugins" });
    }
}
