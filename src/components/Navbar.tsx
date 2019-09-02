import * as React from "react";

import { observer } from 'mobx-react-lite';
import { PlayerId } from '~/state';
import { bannerState } from './TextBanner';

export interface Props {
    currentPlayer: PlayerId;
    onResetGame: () => void;
    onUndo: () => void;
}
export default function Navbar (props: Props) {
    return <div className="navbar">
        {/* <div style={{"gridArea": "p"}}>
            <span>Current Player: </span><span style={{"fontWeight": "bold"}}>Player {props.currentPlayer + 1}</span> 
        </div> */}
        <div className="nav-buttons">
            <button className="blue" onClick={() => props.onUndo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                props.onResetGame();
            }}>Restart Game</button>  
        </div>     
    </div>
}
