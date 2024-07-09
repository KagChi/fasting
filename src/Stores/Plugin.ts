import { LoaderPieceContext, Piece, PieceOptions } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { FastifyInstance } from "fastify";

export abstract class Plugin extends Piece {
    public constructor(context: LoaderPieceContext, options: PieceOptions) {
        super(context, options);
    }

    public abstract run(fastify: FastifyInstance): Awaitable<unknown>;
}
