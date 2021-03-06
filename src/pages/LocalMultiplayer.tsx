import * as React from "react";
import { Route } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import "./Game.scss";
import { GameState } from '~/state/game';
import { modalState } from '~/components/Modal';
import { nameState } from '~/state/name';
import { history } from '~/router';

@observer
export default class LocalMultiplayerPage extends Route {
    localGameState = new GameState();

    restartGame() {
        const done = () => {
            nameState.syncNames();
            modalState.show = false;
            this.localGameState.reset(nameState.p1name, nameState.p2name);
        };
        const goback = () => {
            history.push("/"); 
            modalState.show = false;
        }
        modalState.ask(observer( () => <>
            <div className="modal-content-inner">
                <div className="modal-content-inner-row">
                    Player 1: <input type="text" value={nameState.p1name} onChange={e => {
                        nameState.p1name = e.target.value;
                    }} />
                </div>
                <div className="modal-content-inner-row">
                    Player 2: <input type="text" value={nameState.p2name} onChange={e => {
                        nameState.p2name = e.target.value;
                    }} />
                </div>
            </div>
            <div className="modal-content-btns">
                <button className="green" onClick={done}>Start!</button>
                <button className="red" onClick={goback}>Go Back</button>
            </div>
        </>), done)
    }
    componentDidMount() {
        this.restartGame();
    }
    render() {
        const cState = this.localGameState.currentStage;
        const cpName = this.localGameState.currentPlayerName;
        const opName = this.localGameState.otherPlayerName;
        return <div id="game-page">
            <Cover
                currentPlayer={cpName}
                won={this.localGameState.winState.won}
                onReset={() => this.restartGame()}
            />
            <Navbar
                onResetGame={() => this.restartGame()}
                onUndo={() => this.localGameState.undo()}
            />
            <BottomBar gameStateStage={cState} currentPlayer={cpName} otherPlayer={opName}/>
            <Board 
                winState={this.localGameState.winState}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => this.localGameState.placeGamePiece(x,y)}
                onResetGame={() => this.restartGame()}
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
