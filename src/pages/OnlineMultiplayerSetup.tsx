import * as React from "react";
import {Route} from "react-router";
import QRCode from "qrcode.react";
import moment from "moment";


import { history } from "~/router";
import { getUID, gamedb, getSecretPhrase, sphrasedb, getAliases, saveAliases, aliasdb } from '~/database';
import Loader from '~/components/Loader';

import "./OnlineMultiplayerSetup.scss";
import { modalState } from '~/components/Modal';
import { bannerState } from '~/components/TextBanner';

function QRDisplayer(p : { code?: string; }) {
    return <>
        <div id="qr-loader"><Loader/></div>
        {p.code && <QRCode value={p.code}/>}
        <div id="qr-code">{p.code}</div>
    </>
} 

interface GameMetaData {
    uid: string;
    opponent: string;
    lastplayed: number;
    turn: number | string;
}
export default class OnlineMultiplayerSetupPage extends Route {
    state: { 
        uid?: string; 
        games: GameMetaData[]; 
        myName: string;
        opnSPhrase?: string;
    } = { games: [], myName: "Player 1" };

    removeListener: () => void; 

    async componentDidMount() {
        this.setState({
            myName: getAliases().p1,
        })
        await Promise.all([
            getSecretPhrase().then( sphrase => this.setState({
                uid: sphrase
            })),
            getUID().then( uid => this.removeListener = gamedb.
                where(`users`, 'array-contains', uid).
                where('winState.won', '==', false).onSnapshot( 
                    async snap => {
                        let games = await Promise.all(snap.docs.map( async doc => {
                            const data = doc.data();
                            const ouid: string = data['users'].filter( u => u !== uid )[0];

                            let turn: string | number = "game-over";
                            if( !data['winState'].won ) {
                                turn = ( data['state'] as string[]).reduce(
                                    (acc, row) => acc + row.split('|').map(cell => cell === '----' ? 0 : 1).reduce( (a, b) => a + b, 0),
                                    0
                                )
                            };
                            return {
                                uid: doc.id,
                                opponent: (await aliasdb.child(ouid).once('value')).val() || "Unknown",
                                turn,
                                lastplayed: data['updated']
                            }
                        }));
                        this.setState({
                            games
                        })
                    }
                )
            )
        ])
    }
    componentWillUnmount() {
        this.removeListener();
    }
    async createGame(opn: string, opnName: string = "Player 2") {
        const uid = await getUID();
        const update: any = {
            users: [
                uid, opn,
            ],
            current: Math.random() > 0.5 ? uid : opn,
            state: [
                '----|----|----|----',
                '----|----|----|----',
                '----|----|----|----',
                '----|----|----|----',
            ],
            piece: null,
            winState: { won: false },
            started: Date.now(),
            updated: Date.now(),
        };
        return await gamedb.add(update)
    }
    public render() {
        let qrCls = "qr";
        if ( this.state.uid ) { qrCls += " --loaded"};
        return <div id="online-multiplayer-setup-page">
            <div className="name-tab">
                <span>Your Name: </span>
                <input type="text" value={this.state.myName} onChange={e => {
                    this.setState({
                        myName: e.target.value
                    });
                    saveAliases(e.target.value);
                }}/>
            </div>
            <div className="btns">
                <button onClick={() => {
                        history.push("/")
                }} className="btn-home">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAAAmJLR0QA/4ePzL8AAAE5SURBVFjD7dQ9S8NAHMfxb6Uogo+DDnXJVhdxclNERPAdiEtxcnbrW8jq6OokCCKIoxbqw1AKTi7i4mJR6VCQDlr6d0iuBNvo9bxDkft9txD4DLkL/MEFlCgRuCRWeEIQ6qy7ATIUaSFxbUIGbBNjHHUA1SmTNol57rsIQXhgIX4j+dRoBZo9CUFoUgBghzdzZIjdVEC1zzCwyKMZMsP1t4QgVAmAKc76R5apaRGC8MIakCWkbXpgdWpRJANs6BKjHPYFqE6Y0CVmuTUiBOGOOR1ik1djIjrUW18DWcIfAao9BtOIac6tEIJwSa4XsdS5THZ6ZvUzsZ34LdjqPT7UAIxwYB1QHTMeIRWEhhOigVCJkCtuyDtB8lQpJ7+KC6RrHvHIv0bS5hGPeMQjHvHILyAX1pEyfib7AN2GgOq5GZnpAAAAAElFTkSuQmCC"/>
                </button>
                <button disabled={this.state.uid === undefined} onClick={async () => {
                    modalState.ask(() => <>
                        <div className="modal-content-inner">
                            <h4 style={{textAlign: "center"}}>Opponent Secret Passphrase: </h4>
                            <input type="text" value={this.state.opnSPhrase} onChange={e => {
                                this.setState({ opnSPhrase: e.target.value });
                            }}/>
                        </div>
                        <div className="modal-content-btns">
                            <button onClick={async () => {
                                const ouid = (await sphrasedb.child("/ptu/" + this.state.opnSPhrase).once('value')).val();
                                if (!ouid) {
                                    bannerState.notify("Invalid passphrase!");
                                }   else    {
                                    const r = await this.createGame(ouid);
                                    history.push(`/online/${r.id}`);
                                    modalState.show = false;
                                }
                            }}>Connect</button>
                            <button onClick={() => {
                                modalState.show = false;
                            }}>Cancel</button>
                        </div>
                    </>);
                }}>Join by phrase</button>
                <button onClick={() => {
                    bannerState.notify("WIP - coming soon!", 3000);
                }}>Scan</button>
            </div>
            <div className={qrCls}>
                <QRDisplayer code={this.state.uid}/>
            </div>
            <table className="pure-table">
                {(this.state.games.length > 0) && <thead>
                    <tr>
                        <th>Opponent</th>
                        <th>Turn #</th>
                        <th>Last Played</th>
                        <th></th>
                    </tr>
                </thead>}
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