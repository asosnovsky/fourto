import * as React from "react";
import { PlayerId } from '~/state';


export interface Props {
    won: boolean;
    currentPlayer: PlayerId;
    onReset: () => void;
}
export default function Cover(p: Props) {
    return <div className="cover" style={{
        opacity: p.won ? 1 : 0,
        top: p.won ? '0' : '-200vh',
    }}>
        <div>
            <span>Player #{p.currentPlayer + 1} has won!</span>
            <button onClick={()=>{
                p.onReset();
            }}>Play Again?</button>
        </div>
    </div>
}