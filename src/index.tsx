import * as React from "react";
import { render } from "react-dom";

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import TextBanner, { bannerState } from "~/components/TextBanner";
import { observer } from 'mobx-react-lite';
import { gameState } from './state';

const Navbar = observer(() => {
    return <div className="navbar">
        <div style={{"gridArea": "p"}}>
            <span>Current Player: </span><span style={{"fontWeight": "bold"}}>Player {gameState.currentPlayer + 1}</span> 
        </div>
        <div style={{"gridArea": "b"}}>
            <button className="blue" onClick={() => gameState.undo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                gameState.reset();
                bannerState.notify(`Game Restarted! Player #${gameState.currentPlayer+1} Turn!`, 1000)
            }}>Restart Game</button>  
        </div>     
    </div>
})

render(<>
    <TextBanner/>
    <Board/>
    <OpenPieces/>
    <Navbar/>
</>, document.getElementById("app"));
