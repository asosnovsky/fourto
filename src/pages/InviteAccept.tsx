import * as React from "react";
import { RouteComponentProps } from "react-router";
import { createGameThenGoToIt, aliasdb, getUID, sphrasedb } from '~/database';
import { observer } from 'mobx-react-lite';
import { nameState } from '~/state/name';

import "./InviteAccept.scss";
import { bannerState } from '~/components/TextBanner';
import { history } from '~/router';

export type Props = RouteComponentProps<{ sphrase: string }>;
const Namer = observer(() => <>
    <input type="text" value={nameState.p1name} onChange={
       e => nameState.p1name = e.target.value
    }/>
</>)
export default class InviteAcceptPage extends React.Component<Props> {
    state: { oname: string; ouid?: string; own?: boolean } = { oname: this.props.match.params.sphrase }
    async componentDidMount() {
        const { sphrase } = this.props.match.params; 
        const ouid = (await sphrasedb.child("ptu/" + sphrase).once('value')).val();
        if ( !ouid ) {
            bannerState.warn("Invalid invite link -- incorrect phrase", 3000);
            setTimeout(() => history.push("/"), 1500);
            return;
        }
        this.setState({ ouid });
        
        if ( ouid === await getUID() ) {
            bannerState.warn("You cannot use your own invite link, please send this to someone else!", 3000);
            this.setState({ own: true })
            return;
        }

        const oname = (await aliasdb.child(ouid).once('value')).val();
        if (oname) {
            this.setState({
                oname,
            });
        }  else {
            bannerState.warn("Invalid invite link", 3000);
            setTimeout(() => history.push("/"), 1500);
        }

    }

    render() {
        return <div id="invite-accept-page" className={this.state.own ? "shaded" : "active"}>
            <div className="main">
                <h4>{this.state.oname} has invited you to a game.</h4>
                <div>Your alias: <Namer/></div>
                <button onClick={() => {
                    this.state.ouid && createGameThenGoToIt(this.state.ouid);        
                }} disabled={this.state.own}>Start Game</button>
            </div>
            <div className="warn">
                <div>
                    <div>
                        Send this link to someone else!
                        <button onClick={() => history.push("/")}>Home Page</button>
                    </div>
                </div>
            </div>
        </div>
    }
}