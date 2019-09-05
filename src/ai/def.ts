import { GamePieceProps } from "~/components/GamePiece";
import { BoardGamePieces, GamePieceList, GameState } from '~/state/game';
import { bannerState } from '~/components/TextBanner';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export interface AIPlayer {
    placePiece: (p: GamePieceProps, b: BoardGamePieces) => {x: number; y: number} | undefined;
    givePiece: (us: GamePieceList, b: BoardGamePieces) => number | undefined;
}

export async function playAgainst(board: GameState, ai: AIPlayer) {
    const cStage = board.currentStage;
    await sleep(700);
    if( cStage === "select-piece") {
        const gp = ai.givePiece(board.gamePieces, board.spots);
        if( gp !== undefined ) {
            board.givePiece(gp)
        }
    }   else if ( cStage === "place-piece" ) {
        if (board.stagePiece !== null) {
            const gp = board.gamePieces[board.stagePiece];
            if ( gp ) {
                const where = ai.placePiece(gp, board.spots);
                if (where) {
                    board.placeGamePiece(where.x, where.y);
                }
            }   else    {
                bannerState.notify(`playAgainst::place-piece (gp === undefined)`)
            }
        }   else    {
            bannerState.notify(`playAgainst::place-piece (stagePiece === null)`)
        }
    }
}