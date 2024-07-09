/* eslint-disable func-names */
import { LoaderPieceContext, Piece, PieceOptions } from "@sapphire/pieces";

export abstract class Plugin extends Piece {
    public constructor(context: LoaderPieceContext, options: PieceOptions) {
        super(context, options);
    }
}
