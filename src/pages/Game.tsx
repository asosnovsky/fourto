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
        this.localGameState.reset("Player 1", "Player 2");
    }
    render() {
        const cState = this.localGameState.currentStage;
        const cpName = this.localGameState.currentPlayerName;
        const opName = this.localGameState.otherPlayerName;
        return <div id="game-page">
            <Cover
                currentPlayer={cpName}
                won={this.localGameState.winState.won}
                onReset={() => this.localGameState.reset("Player 1", "Player 2")}
            />
            <Navbar
                onResetGame={() => this.localGameState.reset("Player 1", "Player 2")}
                onUndo={() => this.localGameState.undo()}
            />
            <BottomBar gameStateStage={cState} currentPlayer={cpName} otherPlayer={opName}/>
            <Board 
                winState={this.localGameState.winState}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => this.localGameState.placeGamePiece(x,y)}
                onResetGame={() => this.localGameState.reset("Player 1", "Player 2")}
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
