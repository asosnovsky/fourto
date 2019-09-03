import * as React from "react";
import {Route} from "react-router";
import QRCode from "qrcode.react";
import moment from "moment";


import { history } from "~/router";
import { getUID, gamedb } from '~/database';
import Loader from '~/components/Loader';

import "./OnlineMultiplayerSetup.scss";

function QRDisplayer(p : { code?: string; }) {
    return <>
        <div><Loader/></div>
        {p.code && <QRCode value={p.code}/>}
        <span>{p.code}</span>
    </>
} 

interface GameMetaData {
    uid: string;
    opponent: string;
    lastplayed: number;
    turn: number | string;
}
export default class OnlineMultiplayerSetupPage extends Route {
    state: { uid?: string; games: GameMetaData[] } = { games: [] };

    removeListener: () => void; 

    async componentDidMount() {
        const uid = await getUID();
        this.setState({
            uid
        });
        this.removeListener = gamedb.where('users', 'array-contains', uid).where('winState.won', '==', false).onSnapshot( snap => {
            this.setState({
                games: snap.docs.map( doc => {
                    const data = doc.data();
                    const ouid = (data['users'] as string[]).map((u,i) => ({u, i})).filter( ({u, i}) => u !== uid)[0];
                    let turn: string | number = "game-over";
                    if( !data['winState'].won ) {
                        turn = ( data['state'] as string[]).reduce(
                            (acc, row) => acc + row.split('|').map(cell => cell === '----' ? 0 : 1).reduce( (a, b) => a + b, 0),
                            0
                        )
                    }
                    return {
                        uid: doc.id,
                        opponent: data["aliases"][ouid.i],
                        turn,
                        lastplayed: data['updated']
                    }
                })
            })
        } )
    }
    componentWillUnmount() {
        this.removeListener();
    }
    public render() {
        let qrCls = "qr";
        if ( this.state.uid ) { qrCls += " --loaded"};
        return <div id="online-multiplayer-setup-page">
            <div className="btns">
                <button disabled={this.state.uid === undefined} onClick={async () => {
                    await gamedb.add({
                        users: [this.state.uid, "a"],
                        current: Math.random() > 0.5 ? this.state.uid : "a",
                        state: [
                            '----|----|----|----',
                            '----|----|----|----',
                            '----|----|----|----',
                            '----|----|----|----',
                        ],
                        aliases: ["Player 1", "Player 2"],
                        piece: null,
                        winState: { won: false },
                        started: Date.now(),
                        updated: Date.now(),
                    })
                }}>Create Game</button>
                <button>Scan</button>
            </div>
            <div className={qrCls}>
                <QRDisplayer code={this.state.uid}/>
            </div>
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Opponent</th>
                        <th>Turn #</th>
                        <th>Last Played</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.games.map( ({uid, turn, lastplayed, opponent}) => <tr key={uid}>
                        <td>{opponent}</td>
                        <td>{turn}</td>
                        <td>{moment(lastplayed).fromNow()}</td>
                        <td>
                            <button onClick={() => history.push("/online/" + uid)}>
                            Play
                            </button>
                        </td>
                    </tr> )}
                </tbody>
            </table>
        </div>
    }
}