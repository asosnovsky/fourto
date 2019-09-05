import * as React from "react";
import {Route} from "react-router";
import { history } from "~/router";

import "./MainPage.scss";
import { bannerState } from '~/components/TextBanner';

export default class MainPage extends Route {
    public render() {
        return <div id="main-page">
            <h1>
                {"FourTO".split("").map( (l, i) => <span key={i} id={`k${i}`}>{l}</span>)}
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
                        "Browser version checker (if your browser version is incompatible an error will show up)"
                    ].map( (txt, i) => <li key={i}>
                        {txt}
                    </li>)} 
                </ul>
            </div>
        </div>
    }
}