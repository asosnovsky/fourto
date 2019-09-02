import * as React from "react";
import {Route} from "react-router";
import { history } from "~/router";

import "./MainPage.scss";
import { bannerState } from '~/components/TextBanner';

export default class MainPage extends Route {
    public render() {
        return <div id="main-page">
            <h4>
                {"FourTO".split("").map( (l, i) => <span key={i} id={`k${i}`}>{l}</span>)}
            </h4>
            <button className="blue" onClick={() => history.push("/singleplayer")}>Single Player</button>
            <button className="green" onClick={() => history.push("/local-multiplayer")}>Local Multiplayer</button>
            <button className="yellow" onClick={() => bannerState.notify("WIP")}>Online Multiplayer</button>
        </div>
    }
}