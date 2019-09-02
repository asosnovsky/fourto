import * as React from "react";
import { Route } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import "./Game.scss";
import { GameState } from '~/state';

@observer
export default class GamePage extends Route {
    localGameState = new GameState();
    componentDidMount() {
        this.localGameState.reset();
    }
    render() {
        const cState = this.localGameState.currentStage;
        let bMsg: string;
        if (cState === "select-piece") {
            bMsg = `Select a piece for player ${1-this.localGameState.currentPlayer + 1}`
        }   else if(cState === "place-piece") {
            bMsg = `Place the piece`
        }   else {
            bMsg = "Game Over."
        }
        return <div id="game-page">
            <Cover
                currentPlayer={this.localGameState.currentPlayer}
                won={this.localGameState.winState.won}
                onReset={() => this.localGameState.reset()}
            />
            <Navbar
                currentPlayer={this.localGameState.currentPlayer}
                onResetGame={() => this.localGameState.reset()}
                onUndo={() => this.localGameState.undo()}
            />
            <BottomBar gameStateStage={cState} currentPlayer={this.localGameState.currentPlayer}/>
            <Board 
                winState={this.localGameState.winState}
                currentPlayer={this.localGameState.currentPlayer}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => this.localGameState.placeGamePiece(x,y)}
                onResetGame={() => this.localGameState.reset()}
            />
            <OpenPieces 
                gamePieces={this.localGameState.gamePieces}
                focusPiece={this.localGameState.stagePiece}
                highlighted={cState === "select-piece"}
                onTake={i => this.localGameState.givePiece(i)}
            />
        </div>
    }

}
