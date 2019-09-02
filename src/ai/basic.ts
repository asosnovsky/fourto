import { AIPlayer } from './def';

export const dumbAI : AIPlayer = {
    placePiece(_, b) {
        let x: number, y: number;
        for (let _ = 0; _ < 10000; _++) {
            [x, y] = [ Math.floor(Math.random()*4), Math.floor(Math.random()*4) ];
            if ( b[x][y] === null ) {
                return {x, y}
            }
        }
        return undefined;
    },
    givePiece(u, _) {
        const availp = u.map( (x, i) => ({x, i}) ).filter( ({x, i}) => x !== null );
        if (availp.length > 0) {
            const sample = Math.floor(Math.random() * availp.length);
            return availp[sample]["i"];
        }   else    {
            return undefined;
        }
    }
}