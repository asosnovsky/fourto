import * as React from "react";
import { GamePiece } from "~/components/GamePiece";
import { GameWinState, BoardGamePieces } from "~/state/game";

import "./Board.scss";

export interface Props {
    winState: GameWinState,
    spots: BoardGamePieces,
    hightlightedPiece: number[] | null,
    highlighted: boolean,
    onPlace: (x: number, y: number) => void,
}
export default  function Board ( props: Props ) {
    let className = "board";
    if (props.highlighted) { className += " highlight" }
    return <div className={className}>
        <div className="board-spots">
            {props.spots.map( (row, rIdx) => row.map( (gp, cIdx) => {
                const key = [rIdx, cIdx].join("");
                if (gp === null) {
                    return <div key={key} id={`bp${rIdx}${cIdx}`} onClick={() => {
                        props.onPlace(rIdx, cIdx);
                    }}/>
                }   else    {
                    return <GamePiece key={key} 
                        highlight={props.hightlightedPiece === null ? false : (
                            (props.hightlightedPiece[0] == rIdx) &&
                            (props.hightlightedPiece[1] == cIdx)
                        ) } 
                        row={rIdx} col={cIdx} {...gp}
                    />
                }
            } ) )}
        </div>
    </div>
}