import * as React from "react";
import { Route } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import { GameState } from '~/state/game';
import { dumbAI, easyAI } from '~/ai/basic';
import { playAgainst } from '~/ai/def';

import "./Game.scss";
import { nameState } from '~/state/name';

@observer
export default class SinglePlayerGamePage extends Route {
    localGameState = new GameState();
    componentDidMount() {
        this.localGameState.reset("Human", "PC");
    }
    render() {
        const cState = this.localGameState.currentStage;
        const cpName = this.localGameState.currentPlayerName;
        const opName = this.localGameState.otherPlayerName;
        if ( this.localGameState.currentPlayer === 1 ) {
            playAgainst(this.localGameState, easyAI);
        }
        const runIf = (cb: () => void) => {
            if ( this.localGameState.currentPlayer === 0) {
                cb();
            }
        }
        return <div id="game-page">
            <Cover
                currentPlayer={cpName}
                won={this.localGameState.winState.won}
                onReset={() => runIf(() => this.localGameState.reset("Human", "PC")) }
            />
            <Navbar
                onResetGame={() => runIf(() => this.localGameState.reset("Human", "PC")) }
                onUndo={() => runIf(() => this.localGameState.undo()) }
            />
            <BottomBar gameStateStage={cState} currentPlayer={cpName} otherPlayer={opName}/>
            <Board 
                winState={this.localGameState.winState}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => runIf(() => this.localGameState.placeGamePiece(x,y)) }
                onResetGame={() => runIf(() => this.localGameState.reset("Human", "PC")) }
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
