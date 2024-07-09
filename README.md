<div align="center">

<img src="https://i.kagchi.my.id/nezuko.png" alt="Logo" width="200px" height="200px" style="border-radius:50%"/>

# @kagchi/fasting

**A Better Fastify auto loads for Routes & Prehandlers**

[![GitHub](https://img.shields.io/github/license/kagchi/fasting)](https://github.com/kagchi/fasting/blob/main/LICENSE)
[![Discord](https://discordapp.com/api/guilds/785715968608567297/embed.png)](https://kagchi.my.id)

</div>


# Installation

## pnpm
```
pnpm add @kagchi/fasting
```

## npm
```
npm i @kagchi/fasting
```

## yarn
```
yarn add @kagchi/fasting
```

# Example Use

## Main file
src/index.ts
```ts
import { fasting } from "@kagchi/fasting";
import fastify from "fastify";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const fastifyApp = fastify({
    logger: true
});

await fastifyApp.register(fasting, {
    basePath: resolve(dirname(fileURLToPath(import.meta.url)))
});

await fastifyApp.listen({ port: 3_000 })
    .then(() => console.log("Server is running on port 3000"))
    .catch(() => console.log("Server failed to start"));
```

## Create routes folder & Create root route
src/routes/index.ts
```ts
import type { RouteOptions } from "@kagchi/fasting";
import { Route } from "@kagchi/fasting";
import type { LoaderPieceContext } from "@sapphire/pieces";
import type { FastifyReply, FastifyRequest } from "fastify";

export class Root extends Route {
    public constructor(context: LoaderPieceContext, options: RouteOptions) {
        super(context, {
            ...options,
            method: "GET",
            path: "/"
        });
    }

    public run(request: FastifyRequest, response: FastifyReply): FastifyReply {
        return response.send("Hello, world!");
    }
}

```
