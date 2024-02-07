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
import Fastify from "fastify";
import { fasting } from "@kagchi/fasting"

const fastify = Fastify({
    logger: true
})

// initiate fasting plugin
fastify.register(fasting)

fastify.listen({ port: 3000 })
```

## Create routes folder
src/routes/index.ts
```ts
import { Route, RouteOptions, } from "@kagchi/fasting"
import { FastifyReply, FastifyRequest } from "fastify"
import { PieceContext } from "@sapphire/pieces"

export class Root extends Route {
    public constructor(context: PieceContext, options: RouteOptions) {
        super(context, {
            ...options,
            method: "GET",
            path: "/"
        })
    }

    public run(req: FastifyRequest, res: FastifyReply) {
        res.send("Hello, world!")
    }
}
```
