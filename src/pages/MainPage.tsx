import * as React from "react";
import {Route} from "react-router";
import { history } from "~/router";

import "./MainPage.scss";
import { bannerState } from '~/components/TextBanner';
import { modalState } from '~/components/Modal';
import manifest from "~/manifest.json";

export default class MainPage extends Route {
    public render() {
        return <div id="main-page">
            <h1>
                {manifest.name.split("").map( (l, i) => <span key={i} id={`k${i}`}>{l}</span>)}
                <i>{manifest.version}</i>
            </h1>
            <div className="btns">
                <button className="blue" onClick={() => history.push("/singleplayer")}>Single Player</button>
                <button className="green" onClick={() => history.push("/local-multiplayer")}>Local Multiplayer</button>
                <button className="yellow" onClick={() => history.push("/online")}>Online Multiplayer</button>
            </div>
            <div className="update-notes">
                <h4>What's New?</h4>
                <ul>
                    {[
                        "Online Multiplayer",
                        "Visual bugfixes (no more side-scrolling error)",
                        "Browser version checker (if your browser version is incompatible an error will show up)",
                        "Added legal notes"
                    ].map( (txt, i) => <li key={i}>
                        {txt}
                    </li>)} 
                </ul>
            </div>
            <button className="legal" onClick={() => {
                modalState.ask( () => <> 
                    <div className="modal-content-inner">
                        By using this application the user agrees to the following data being collected:
                        <ul>
                            <li>During gameplay anytime the user presses a gamepiece the choice of the user is collected</li>
                        </ul>

                        <b>All data collected <u>does not</u> include any personal information of the user</b>.
                        <button className="blue" onClick={() => {
                            modalState.show = false;
                        }}>Okay</button>
                    </div>
                </>)
            }}>Legal</button>
        </div>
    }
}