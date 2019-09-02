import * as React from "react";
import { PlayerId, GameStateStage } from '~/state';


export interface Props {
    currentPlayer: PlayerId;
    gameStateStage: GameStateStage;
}
export default function BottomBar(p: Props) {
    let bMsg: string;
    if (p.gameStateStage === "select-piece") {
        bMsg = `Select a piece for player ${1-p.currentPlayer + 1}`
    }   else if(p.gameStateStage === "place-piece") {
        bMsg = `Place the piece`
    }   else {
        bMsg = "Game Over."
    }
    return <div className="bottom-bar">
        <div className="text">
            <b>Player #{p.currentPlayer + 1}: </b><span>{bMsg}</span>
        </div>
    </div>
}