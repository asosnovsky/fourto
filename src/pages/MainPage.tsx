import * as React from "react";
import {Route} from "react-router";
import { history } from "~/router";

import "./MainPage.scss";
import { modalState } from '~/components/Modal';
import manifest from "~/manifest.json";
import { deleteAllCookies } from '~/cookie';
import { auth } from '~/database/index';

import releaseNotes, { version } from "~/release_notes.ts";



export default class MainPage extends Route {
    public render() {
        return <div id="main-page">
            <h1>
                {"FourTO".split("").map( (l, i) => <span key={i} id={`k${i}`}>{l}</span>)}
                <i>{version}</i>
            </h1>
            <div className="btns">
                <button className="blue" onClick={() => history.push("/singleplayer")}>Single Player</button>
                <button className="green" onClick={() => history.push("/local-multiplayer")}>Local Multiplayer</button>
                <button className="yellow" onClick={() => history.push("/online")}>Online Multiplayer</button>
            </div>
            <div className="update-notes">
                <h4>What's New?</h4>
                <ul>
                    {releaseNotes.map( (txt, i) => <li key={i}>
                        {txt}
                    </li>)} 
                </ul>
            </div>
            <button className="legal" onClick={() => {
                modalState.ask( () => <> 
                    <div className="modal-content-inner">
                        By using this application the user agrees to the following data being collected:
                        <p style={{textAlign: "center"}}>
                            <i>
                                During gameplay anytime the user presses a gamepiece the choice of the user is collected
                            </i>
                        </p>
                        <p style={{textAlign: "center"}}>
                            <b>All data collected <u>does not</u> include any personal information of the user</b>.
                        </p>
                        <button className="blue" onClick={() => {
                            modalState.show = false;
                        }}>Okay</button>
                        <button className="red" onClick={async () => {
                            deleteAllCookies();
                            localStorage.clear();
                            await auth.signOut();
                            window.location.reload(true);
                        }}>Clear all the references to me</button>
                    </div>
                </>)
            }}>Legal</button>
            <button className="update-btn" onClick={() => {
                deleteAllCookies();
                localStorage.clear();
                window.location.reload(true);
            }}>Update</button>
        </div>
    }
}