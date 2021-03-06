import * as React from "react";
import { GamePiece } from "~/components/GamePiece";
import { GamePieceList } from "~/state/game";

import "./OpenPieces.scss";

export interface Props {
    gamePieces: GamePieceList;
    focusPiece: number | null;
    highlighted: boolean;
    onTake: (i: number) => void;
}
export default function OpenPieces(props: Props) {
    let className = "open-pieces";
    if (props.highlighted) { className += " highlight" }
    return <div className={className}>
        {props.gamePieces.map( (gp, i) => {
            const rIdx = Math.floor(i / 2);
            const cIdx= i % 2;
            const key = [rIdx, cIdx].join("");
            if (gp !== null) {
                return <GamePiece key={key} row={rIdx} col={cIdx}
                            highlight={props.focusPiece === i} 
                            shadded={props.focusPiece !== null ? props.focusPiece !== i : false} {...gp} 
                    onClick={() => {
                        props.onTake(i)
                    }
                }/>
            }   else    {
                return <div key={key} id={`bp${rIdx}${cIdx}`}/>
            }
        } )}
    </div>
}