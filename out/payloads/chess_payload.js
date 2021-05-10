export var ChessPieceType;
(function (ChessPieceType) {
    ChessPieceType["KING"] = "\u2654";
    ChessPieceType["QUEEN"] = "\u2655";
    ChessPieceType["ROOK"] = "\u2656";
    ChessPieceType["BISHOP"] = "\u2657";
    ChessPieceType["KNIGHT"] = "\u2658";
    ChessPieceType["PAWN"] = "\u2659";
})(ChessPieceType || (ChessPieceType = {}));
export var ChessColor;
(function (ChessColor) {
    ChessColor[ChessColor["BLACK"] = 0] = "BLACK";
    ChessColor[ChessColor["WHITE"] = 1] = "WHITE";
})(ChessColor || (ChessColor = {}));
class ChessPiece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }
    static fromStr(repr) {
        if (repr.length != 2)
            return undefined;
        let color;
        switch (repr[0]) {
            case 'b':
                color = ChessColor.BLACK;
                break;
            case 'w':
                color = ChessColor.WHITE;
                break;
            default: throw Error('malformed chess piece color');
        }
        let type;
        switch (repr[1]) {
            case 'K':
                type = ChessPieceType.KING;
                break;
            case 'Q':
                type = ChessPieceType.QUEEN;
                break;
            case 'R':
                type = ChessPieceType.ROOK;
                break;
            case 'B':
                type = ChessPieceType.BISHOP;
                break;
            case 'N':
                type = ChessPieceType.KNIGHT;
                break;
            case 'P':
                type = ChessPieceType.PAWN;
                break;
            default: throw Error('malformed chess piece type');
        }
        return new ChessPiece(type, color);
    }
    static random() {
        const color = Math.random() < 0.5 ? ChessColor.BLACK : ChessColor.WHITE;
        let type;
        switch (Math.floor(Math.random() * 6)) {
            case 0:
                type = ChessPieceType.KING;
                break;
            case 1:
                type = ChessPieceType.QUEEN;
                break;
            case 2:
                type = ChessPieceType.ROOK;
                break;
            case 3:
                type = ChessPieceType.BISHOP;
                break;
            case 4:
                type = ChessPieceType.KNIGHT;
                break;
            case 5:
            default:
                type = ChessPieceType.PAWN;
                break;
        }
        return new ChessPiece(type, color);
    }
}
export class ChessPayload {
    constructor(w, h) {
        this.dims = [w, h];
        this.board = [];
        for (let columnIdx = 0; columnIdx < w; ++columnIdx) {
            const column = [];
            for (let rowIdx = 0; rowIdx < h; ++rowIdx) {
                column.push(ChessPiece.random());
            }
            this.board.push(column);
        }
    }
    static make() {
    }
}
