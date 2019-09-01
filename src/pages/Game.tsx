import * as React from "react";
import { Route } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";

import "./Game.scss";
import { GameState } from '~/state';


@observer
export default class GamePage extends Route {
    localGameState = new GameState();
    componentDidMount() {
        this.localGameState.reset();
    }
    render() {
        return <div id="game-page">
            <Board 
                winState={this.localGameState.winState}
                currentPlayer={this.localGameState.currentPlayer}
                spots={this.localGameState.spots}
                onPlace={(x,y) => this.localGameState.placeGamePiece(x,y)}
                onResetGame={() => this.localGameState.reset()}
            />
            <OpenPieces 
                gamePieces={this.localGameState.gamePieces}
                focusPiece={this.localGameState.stagePiece}
                onTake={i => this.localGameState.givePiece(i)}
            />
            <Navbar
                currentPlayer={this.localGameState.currentPlayer}
                onResetGame={() => this.localGameState.reset()}
                onUndo={() => this.localGameState.undo()}
            />
        </div>
    }

}
