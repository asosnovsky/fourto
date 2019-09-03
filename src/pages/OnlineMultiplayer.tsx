import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import "./Game.scss";
import { GameState } from '~/state';
import { gamedb } from '~/database';
import { history } from '~/router';
import { bannerState } from '~/components/TextBanner';

@observer
export default class OnlineMultiplayerPage extends React.Component<RouteComponentProps<{ gameid: string }>> {
    localGameState = new GameState();
    gameDoc: firebase.firestore.DocumentReference;
    lastUpdate: number;
    unsub: () => void;
    async componentDidMount() {
        this.gameDoc = gamedb.doc(this.props.match.params.gameid);
        const snap = await this.gameDoc.get()
        this.localGameState.resetFromSnap(snap);
        this.lastUpdate = Date.now();
        this.unsub = this.gameDoc.onSnapshot( snap => {
            if (this.lastUpdate !== snap.get("updated")) {
                const lastMove = snap.get("lastMove");
                if (lastMove[0] === "p") {
                    this.localGameState.placeGamePiece(lastMove[1], lastMove[2]);
                }   else if (lastMove[0] === "g") {
                    this.localGameState.givePiece(lastMove[1]);
                }   else    {
                    bannerState.confirm(
                        `Error: lastMove = ${lastMove[0]} Invalid Move. Exit Game?`,
                        () => history.push("/online")
                    )
                }
                this.lastUpdate = snap.get("updated");
            }
        });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        const cState = this.localGameState.currentStage;
        const cpName = this.localGameState.currentPlayerName;
        const opName = this.localGameState.otherPlayerName;
        return <div id="game-page">
            <Cover
                currentPlayer={cpName}
                won={this.localGameState.winState.won}
                onReset={() => history.push('/online')}
            />
            <Navbar
                onResetGame={() => history.push('/online')}
                onUndo={() => this.localGameState.undo()}
            />
            <BottomBar gameStateStage={cState} currentPlayer={cpName} otherPlayer={opName}/>
            <Board 
                winState={this.localGameState.winState}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={async (x,y) => {
                    this.localGameState.placeGamePiece(x,y);
                    this.lastUpdate = Date.now();
                    await this.gameDoc.update({
                        "lastMove": ['p', x, y],
                        "state": this.localGameState.toStateStrings(),
                        "winState": this.localGameState.winState,
                        "updated": this.lastUpdate,
                    });
                }}
                onResetGame={() => history.push('/online')}
            />
            <OpenPieces 
                gamePieces={this.localGameState.gamePieces}
                focusPiece={this.localGameState.stagePiece}
                highlighted={cState === "select-piece"}
                onTake={async i => {
                    this.localGameState.givePiece(i);
                    this.lastUpdate = Date.now();
                    await this.gameDoc.update({
                        "lastMove": ['g', i],
                        "state": this.localGameState.toStateStrings(),
                        "winState": this.localGameState.winState,
                        "updated": this.lastUpdate,
                    });
                }}
            />
        </div>
    }

}
