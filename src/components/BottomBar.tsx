import * as React from "react";
import { GameStateStage } from '~/state';


export interface Props {
    currentPlayer: string;
    otherPlayer: string;
    gameStateStage: GameStateStage;
}
export default function BottomBar(p: Props) {
    let bMsg: string;
    if (p.gameStateStage === "select-piece") {
        bMsg = `Select a piece for ${p.otherPlayer}`
    }   else if(p.gameStateStage === "place-piece") {
        bMsg = `Place the piece`
    }   else {
        bMsg = "Game Over."
    }
    return <div className="bottom-bar">
        <div className="text">
            <b>{p.currentPlayer}: </b><span>{bMsg}</span>
        </div>
    </div>
}