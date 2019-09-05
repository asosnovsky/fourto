import * as React from "react";
import {Route} from "react-router";
import QRCode from "qrcode.react";
import moment from "moment";


import { history } from "~/router";
import { getUID, gamedb, getSecretPhrase, sphrasedb, aliasdb } from '~/database';
import Loader from '~/components/Loader';

import "./OnlineMultiplayerSetup.scss";
import { modalState } from '~/components/Modal';
import { bannerState } from '~/components/TextBanner';
import { nameState } from '~/state/name';

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
        passphrase?: string; 
        games: GameMetaData[]; 
        opnSPhrase?: string;
    } = { games: [] };

    removeListener: () => void; 

    async componentDidMount() {
        await Promise.all([
            getSecretPhrase().then( sphrase => this.setState({
                passphrase: sphrase
            })),
            getUID().then( uid => this.removeListener = gamedb.
                where(`users`, 'array-contains', uid).
                where('winState.won', '==', false).onSnapshot( 
                    async snap => {
                        let games = await Promise.all(snap.docs.map( async doc => {
                            const data = doc.data();
                            const ouid: string = (data['users'] as string[]).filter( u => u !== uid )[0];

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
        if ( this.state.passphrase ) { qrCls += " --loaded"};
        return <div id="online-multiplayer-setup-page">
            <div className="name-tab">
                <span>Your Name: </span>
                <input type="text" value={nameState.p1name} onChange={e => {
                    nameState.p1name = e.target.value;
                    nameState.syncNames();
                }}/>
            </div>
            <div className="btns">
                <button onClick={() => {
                        history.push("/")
                }} className="btn-home">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAAAmJLR0QA/4ePzL8AAAE5SURBVFjD7dQ9S8NAHMfxb6Uogo+DDnXJVhdxclNERPAdiEtxcnbrW8jq6OokCCKIoxbqw1AKTi7i4mJR6VCQDlr6d0iuBNvo9bxDkft9txD4DLkL/MEFlCgRuCRWeEIQ6qy7ATIUaSFxbUIGbBNjHHUA1SmTNol57rsIQXhgIX4j+dRoBZo9CUFoUgBghzdzZIjdVEC1zzCwyKMZMsP1t4QgVAmAKc76R5apaRGC8MIakCWkbXpgdWpRJANs6BKjHPYFqE6Y0CVmuTUiBOGOOR1ik1djIjrUW18DWcIfAao9BtOIac6tEIJwSa4XsdS5THZ6ZvUzsZ34LdjqPT7UAIxwYB1QHTMeIRWEhhOigVCJkCtuyDtB8lQpJ7+KC6RrHvHIv0bS5hGPeMQjHvHILyAX1pEyfib7AN2GgOq5GZnpAAAAAElFTkSuQmCC"/>
                </button>
                <button disabled={this.state.passphrase === undefined} onClick={async () => {
                    modalState.ask(() => <>
                        <div className="modal-content-inner">
                            <h4 style={{textAlign: "center"}}>Opponent Secret Passphrase: </h4>
                            <input style={{
                                width: "100%",
                                marginBottom: "10%"
                            }} type="text" value={this.state.opnSPhrase} onChange={e => {
                                const value = e.target.value.toLowerCase().split(' ').join('-');
                                e.target.value = value;
                                this.setState({ opnSPhrase: value });
                            }}/>
                        </div>
                        <div className="modal-content-btns">
                            <button onClick={async () => {
                                if ( this.state.passphrase === this.state.opnSPhrase) {
                                    bannerState.warn("This is your passphrase!", 3000)
                                }   else if ( this.state.passphrase || this.state.passphrase.length === 0 ) {
                                    bannerState.warn("Please enter your opponent passphrase!", 3000)
                                } else  {
                                    const ouid = (await sphrasedb.child("/ptu/" + this.state.opnSPhrase).once('value')).val();
                                    if (!ouid) {
                                        bannerState.warn("Invalid passphrase!", 3000);
                                    }   else    {
                                        const r = await this.createGame(ouid);
                                        history.push(`/online/${r.id}`);
                                        modalState.show = false;
                                    }
                                }
                            }}>Connect</button>
                            <button onClick={() => {
                                modalState.show = false;
                            }}>Cancel</button>
                        </div>
                    </>);
                }}>Join by phrase</button>
                <button onClick={() => {
                    bannerState.warn("WIP - coming soon!", 3000);
                }}>Scan</button>
            </div>
            <div className={qrCls}>
                <QRDisplayer code={this.state.passphrase}/>
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