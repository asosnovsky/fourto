import * as React from "react";
import { history } from '~/router';
import { bannerState } from './TextBanner';

export interface Props {
    msg?: string;
    onResetGame: () => void;
    onUndo: () => void;
}
export default function Navbar (props: Props) {
    const msg = props.msg || "Going back to main page, this means that your game is over.";
    return <div className="navbar">
        <button onClick={() => {
            bannerState.confirm(msg, () => {
                history.push("/")
            })
        }}>
            Back
        </button>
        <button className="blue" onClick={() => props.onUndo()}>Undo Last Move</button>       
        <button className="red" onClick={() => {
            bannerState.confirm("Restarting the game.", () => {
                props.onResetGame();
            })
        }}>Restart Game</button>  
    </div>
}
