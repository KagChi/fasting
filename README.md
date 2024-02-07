<div align="center">

<img src="https://i.kagchi.my.id/nezuko.png" alt="Logo" width="200px" height="200px" style="border-radius:50%"/>

# @kagchi/fasting

**A Fastify dynamic routing per file, OOP Based**

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

# Usecase

## Main file
src/index.ts
```ts
import { fasting } from "@kagchi/fasting";
import fastify from "fastify";

const fastifyApp = fastify({
    logger: true
});

await fastifyApp.register(fasting);

await fastifyApp.listen({ port: 3_000 }).then(() => console.log("Server is running on port 3000")).catch(() => console.log("Server failed to start"));
```

## Create routes folder
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
