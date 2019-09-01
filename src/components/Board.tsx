import * as React from "react";
import { GamePiece } from "~/components/GamePiece";
import { PlayerId, GameWinState, BoardGamePieces } from "~/state";

import "./Board.scss";

export interface Props {
    winState: GameWinState,
    currentPlayer: PlayerId,
    spots: BoardGamePieces,
    onResetGame: () => void,
    onPlace: (x: number, y: number) => void,
}
export default  function Board ( props: Props ) {
    return <div className="board">
        <div className="cover" style={{
            display: props.winState.won ? 'initial' : 'none'
        }}>
            <div>
                <span>Player #{props.currentPlayer + 1} has won!</span>
                <button onClick={()=>{
                    props.onResetGame();
                }}>Play Again?</button>
            </div>
        </div>
        {props.spots.map( (row, rIdx) => row.map( (gp, cIdx) => {
            const key = [rIdx, cIdx].join("");
            if (gp === null) {
                return <div key={key} id={`bp${rIdx}${cIdx}`} onClick={() => {
                    props.onPlace(rIdx, cIdx);
                }}/>
            }   else    {
                return <GamePiece key={key} row={rIdx} col={cIdx} {...gp}/>
            }
        } ) )}
    </div>
}