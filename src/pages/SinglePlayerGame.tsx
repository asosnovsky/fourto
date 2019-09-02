import * as React from "react";
import { Route } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import { GameState } from '~/state';
import { dumbAI } from '~/ai/basic';
import { playAgainst } from '~/ai/def';

import "./Game.scss";

@observer
export default class SinglePlayerGamePage extends Route {
    localGameState = new GameState();
    componentDidMount() {
        this.localGameState.reset();
    }
    render() {
        const cState = this.localGameState.currentStage;
        if ( this.localGameState.currentPlayer === 1 ) {
            playAgainst(this.localGameState, dumbAI);
        }
        const runIf = (cb: () => void) => {
            if ( this.localGameState.currentPlayer === 0) {
                cb();
            }
        }
        return <div id="game-page">
            <Cover
                currentPlayer={this.localGameState.currentPlayer}
                won={this.localGameState.winState.won}
                onReset={() => runIf(() => this.localGameState.reset()) }
            />
            <Navbar
                currentPlayer={this.localGameState.currentPlayer}
                onResetGame={() => runIf(() => this.localGameState.reset()) }
                onUndo={() => runIf(() => this.localGameState.undo()) }
            />
            <BottomBar gameStateStage={cState} currentPlayer={this.localGameState.currentPlayer}/>
            <Board 
                winState={this.localGameState.winState}
                currentPlayer={this.localGameState.currentPlayer}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => runIf(() => this.localGameState.placeGamePiece(x,y)) }
                onResetGame={() => runIf(() => this.localGameState.reset()) }
            />
            <OpenPieces 
                gamePieces={this.localGameState.gamePieces}
                focusPiece={this.localGameState.stagePiece}
                highlighted={cState === "select-piece"}
                onTake={i => runIf(() => this.localGameState.givePiece(i)) }
            />
        </div>
    }

}
