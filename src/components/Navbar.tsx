import * as React from "react";

export interface Props {
    onResetGame: () => void;
    onUndo: () => void;
}
export default function Navbar (props: Props) {
    return <div className="navbar">
        <div className="nav-buttons">
            <button className="blue" onClick={() => props.onUndo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                props.onResetGame();
            }}>Restart Game</button>  
        </div>     
    </div>
}
