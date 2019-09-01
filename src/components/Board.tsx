import * as React from "react";
import { GamePiece } from "~/components/GamePiece";
import { PlayerId, GameWinState, BoardGamePieces } from "~/state";

import "./Board.scss";
import { number } from 'prop-types';

export interface Props {
    winState: GameWinState,
    currentPlayer: PlayerId,
    spots: BoardGamePieces,
    hightlighted: number[] | null,
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
                }}>{rIdx},{cIdx}</div>
            }   else    {
                return <GamePiece key={key} 
                    highlight={props.hightlighted === null ? false : (
                        (props.hightlighted[0] == rIdx) &&
                        (props.hightlighted[1] == cIdx)
                    ) } 
                    row={rIdx} col={cIdx} {...gp}
                />
            }
        } ) )}
    </div>
}