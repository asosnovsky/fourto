import * as React from "react";

import { observer } from 'mobx-react-lite';
import { gameState } from '~/state';
import { bannerState } from './TextBanner';

export default observer(() => {
    return <div className="navbar">
        <div style={{"gridArea": "p"}}>
            <span>Current Player: </span><span style={{"fontWeight": "bold"}}>Player {gameState.currentPlayer + 1}</span> 
        </div>
        <div className="nav-buttons">
            <button className="blue" onClick={() => gameState.undo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                gameState.reset();
                bannerState.notify(`Game Restarted! Player #${gameState.currentPlayer+1} Turn!`, 1000)
            }}>Restart Game</button>  
        </div>     
    </div>
})
