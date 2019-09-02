import * as React from "react";
import { GamePiece } from "~/components/GamePiece";
import { PlayerId, GameWinState, BoardGamePieces } from "~/state";

import "./Board.scss";
import { number } from 'prop-types';

export interface Props {
    winState: GameWinState,
    currentPlayer: PlayerId,
    spots: BoardGamePieces,
    hightlightedPiece: number[] | null,
    highlighted: boolean,
    onResetGame: () => void,
    onPlace: (x: number, y: number) => void,
}
export default  function Board ( props: Props ) {
    let className = "board";
    if (props.highlighted) { className += " highlight" }
    return <div className={className}>
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
}