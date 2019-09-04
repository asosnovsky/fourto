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
            }} className="btn-home">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAAAmJLR0QA/4ePzL8AAAE5SURBVFjD7dQ9S8NAHMfxb6Uogo+DDnXJVhdxclNERPAdiEtxcnbrW8jq6OokCCKIoxbqw1AKTi7i4mJR6VCQDlr6d0iuBNvo9bxDkft9txD4DLkL/MEFlCgRuCRWeEIQ6qy7ATIUaSFxbUIGbBNjHHUA1SmTNol57rsIQXhgIX4j+dRoBZo9CUFoUgBghzdzZIjdVEC1zzCwyKMZMsP1t4QgVAmAKc76R5apaRGC8MIakCWkbXpgdWpRJANs6BKjHPYFqE6Y0CVmuTUiBOGOOR1ik1djIjrUW18DWcIfAao9BtOIac6tEIJwSa4XsdS5THZ6ZvUzsZ34LdjqPT7UAIxwYB1QHTMeIRWEhhOigVCJkCtuyDtB8lQpJ7+KC6RrHvHIv0bS5hGPeMQjHvHILyAX1pEyfib7AN2GgOq5GZnpAAAAAElFTkSuQmCC"/>
            </button>
            <button className="blue" onClick={() => props.onUndo()}>Undo Last Move</button>       
            <button className="red" onClick={() => {
                bannerState.confirm("Restarting the game.", () => {
                    props.onResetGame();
                })
            }}>Restart Game</button>  
        </div>     
    </div>
}
