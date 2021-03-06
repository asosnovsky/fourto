import * as React from "react";
import { history } from '~/router';


export interface Props {
    won: boolean;
    currentPlayer: string;
    onReset: () => void;
}
export default function Cover(p: Props) {
    return <div className="cover" style={{
        opacity: p.won ? 1 : 0,
        top: p.won ? '0' : '-200vh',
    }}>
        <div>
            <span>{p.currentPlayer} has won!</span>
            <button onClick={()=>{
                p.onReset();
            }}>Play Again?</button>
            <button onClick={()=>{
                history.push("/");
            }}>Back Home</button>
        </div>
    </div>
}