import * as React from "react";
import { observer } from "mobx-react";
import { GamePiece } from "~/components/GamePiece";
import { bannerState } from "~/components/TextBanner";
import { gameState } from "~/state";

import "./Board.scss";

export default observer(() => {
    return <div className="board">
        <div className="cover" style={{
            display: gameState.winState.won ? 'initial' : 'none'
        }}>
            <div>
                <span>Player #{gameState.currentPlayer + 1} has won!</span>
                <button onClick={()=>{
                    gameState.reset();
                }}>Play Again?</button>
            </div>
        </div>
        {gameState.spots.map( (row, rIdx) => row.map( (gp, cIdx) => {
            const key = [rIdx, cIdx].join("");
            if (gp === null) {
                return <div key={key} id={`bp${rIdx}${cIdx}`} onClick={() => {
                    if (gameState.stagePiece !== null) {
                        gameState.placeGamePiece(rIdx, cIdx);
                    }
                }}/>
            }   else    {
                return <GamePiece key={key} row={rIdx} col={cIdx} {...gp}/>
            }
        } ) )}
    </div>
})