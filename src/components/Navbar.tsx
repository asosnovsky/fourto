import * as React from "react";
import { history } from '~/router';
import { bannerState } from './TextBanner';

export interface Props {
    onResetGame: () => void;
    onUndo: () => void;
}
export default function Navbar (props: Props) {
    return <div className="navbar">
        <div className="nav-buttons">
            <button onClick={() => {
                bannerState.confirm("Going back to main page, this means that your game is over.", () => {
                    history.push("/")
                })
            }}>&larr;</button>
            <button className="blue" onClick={() => props.onUndo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                bannerState.confirm("Restarting the game.", () => {
                    props.onResetGame();
                })
            }}>Restart Game</button>  
        </div>     
    </div>
}
