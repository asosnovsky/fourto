import * as React from "react";
import { observer } from "mobx-react";
import { GamePiece } from "~/components/GamePiece";
import { gameState } from "~/state";

import "./OpenPieces.scss";

export default observer(() => {
    return <div className="open-pieces">
        {gameState.gamePieces.map( (gp, i) => {
            const rIdx = Math.floor(i / 2);
            const cIdx= i % 2;
            const key = [rIdx, cIdx].join("");
            if (gp !== null) {
                return <GamePiece key={key} row={rIdx} col={cIdx}
                            highlight={gameState.stagePiece === i} 
                            shadded={gameState.stagePiece !== null ? gameState.stagePiece !== i : false} {...gp} 
                    onClick={() => {
                        gameState.givePiece(i)
                    }
                }/>
            }   else    {
                return <div key={key} id={`bp${rIdx}${cIdx}`}/>
            }
        } )}
    </div>
})