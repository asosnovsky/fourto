import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react"

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";
import Cover from '~/components/Cover';
import BottomBar from '~/components/BottomBar';

import "./Game.scss";
import { GameState } from '~/state/game';
import { gamedb, aliasdb, createGameThenGoToIt, setPopUpStatus, sphrasedb } from '~/database/index';
import { history } from '~/router';
import { bannerState } from '~/components/TextBanner';
import Loader from '~/components/Loader';

@observer
export default class OnlineMultiplayerPage extends React.Component<RouteComponentProps<{ gameid: string }>> {
    state: { opnUid?: string, loaded: boolean } = { loaded: false }
    localGameState = new GameState();
    gameDoc: firebase.firestore.DocumentReference;
    lastUpdate: number;
    unsub: () => void;
    async componentDidMount() {
        this.gameDoc = gamedb.doc(this.props.match.params.gameid);
        const snap = await this.gameDoc.get()
        const data = snap.data();
        const ouid = await this.localGameState.resetFromSnap(snap.id, data);
        this.setState({ opnUid: ouid });
        this.lastUpdate = Date.now();

        const unsubGameDoc = this.gameDoc.onSnapshot( snap => {
            if (this.lastUpdate < snap.get("updated")) {
                const lastMove = snap.get("lastMove");
                if( lastMove ) {
                    if (lastMove[0] === "p") {
                        this.localGameState.placeGamePiece(lastMove[1], lastMove[2]);
                    }   else if (lastMove[0] === "g") {
                        this.localGameState.givePiece(lastMove[1], () => {
                            history.push("/online");
                        });
                    }   else    {
                        bannerState.confirm(
                            `Error: lastMove = ${lastMove[0]} Invalid Move. Exit Game?`,
                            () => history.push("/online")
                        )
                    }
                }
                this.lastUpdate = snap.get("updated");
                this.localGameState.currentPlayer = snap.get("current") === ouid ? 1 : 0;
            }
        });
        const p2aliasListener = aliasdb.child(ouid).on('value', snap => {
            this.localGameState.p2name = snap.val();
        });
        // const unsubOtherPlayer = sphrasedb.child(`/utp/${ouid}`).on('value', snap => {
        //     if(!snap.val()) {
        //         bannerState.notify(`${this.localGameState.p2name} has went offline!`)
        //     }
        // });
        this.unsub = () => {
            unsubGameDoc();
            aliasdb.child(ouid).off('value', p2aliasListener);
            // sphrasedb.child(`/utp/${ouid}`).on('value', unsubOtherPlayer);
        };
        this.setState({ loaded: true });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        const cState = this.localGameState.currentStage;
        const cpName = this.localGameState.currentPlayerName;
        const opName = this.localGameState.otherPlayerName;
        const runIf = (cb: () => void) => {
            if ( this.localGameState.currentPlayer === 0) {
                cb();
            }   else    {
                bannerState.notify("Please wait for opponent move!", 2000)
            }
        }
        if(this.localGameState.winState.won) {
            setPopUpStatus(true);
        }
        return <div id="game-page">
            {!this.state.loaded && <div className="game-page-loader">
                <Loader/>
            </div>}
            <Cover
                currentPlayer={cpName}
                won={this.localGameState.winState.won}
                onReset={async () => {
                    if ( this.state.opnUid ) {
                        await createGameThenGoToIt(this.state.opnUid);
                    }   else    {
                        bannerState.warn("Err: opUID == null", 4000);
                    }
                }}
            />
            <Navbar
                msg="Going back to main page, you can always revisit this game after in the online page."
                onResetGame={() => history.push('/online')}
                onUndo={() => runIf(() => {
                    // this.localGameState.undo()
                    bannerState.notify("WIP - coming soon (not supported in online mode yet)", 3000);
                })}
            />
            <BottomBar gameStateStage={cState} currentPlayer={cpName} otherPlayer={opName}/>
            <Board 
                winState={this.localGameState.winState}
                spots={this.localGameState.spots}
                hightlightedPiece={this.localGameState.lastPiece}
                highlighted={cState === "place-piece"}
                onPlace={(x,y) => runIf(async () => {
                    this.localGameState.placeGamePiece(x,y);
                    this.lastUpdate = Date.now();
                    await this.gameDoc.update({
                        "lastMove": ['p', x, y],
                        "state": this.localGameState.toStateStrings(),
                        "winState": this.localGameState.winState,
                        "updated": this.lastUpdate,
                    });
                })}
            />
            <OpenPieces 
                gamePieces={this.localGameState.gamePieces}
                focusPiece={this.localGameState.stagePiece}
                highlighted={cState === "select-piece"}
                onTake={i => runIf(async () => {
                    this.localGameState.givePiece(i, () => {
                        history.push("/online");
                    });
                    this.lastUpdate = Date.now();
                    await this.gameDoc.update({
                        "lastMove": ['g', i],
                        "state": this.localGameState.toStateStrings(),
                        "winState": this.localGameState.winState,
                        "updated": this.lastUpdate,
                        "current": this.state.opnUid,
                    });
                }}
            />
        </div>
    }

}
