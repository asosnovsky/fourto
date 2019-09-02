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
            <div className="cover" style={{
                opacity: this.localGameState.winState.won ? '1' : '0',
                top: this.localGameState.winState.won ? '0' : '-200vh',
            }}>
                <div>
                    <span>Player #{this.localGameState.currentPlayer + 1} has won!</span>
                    <button onClick={()=>{
                        this.localGameState.reset();
                    }}>Play Again?</button>
                </div>
            </div>
            <Navbar
                currentPlayer={this.localGameState.currentPlayer}
                onResetGame={() => this.localGameState.reset()}
                onUndo={() => this.localGameState.undo()}
            />
            <div className="bottom-bar">
                <div className="text">
                    <b>Player #{this.localGameState.currentPlayer + 1}: </b><span>{bMsg}</span>
                </div>
            </div>
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
