import { AIPlayer } from './def';
import { GamePieceOptions } from '~/components/GamePiece';
import { BoardGamePieces } from '~/state/game';

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

// export const easyAI: AIPlayer = makeAIFromQTab(computeQTab)
export const easyAI: AIPlayer = makeAIFromQTab(computeQTab2)
// {
//     placePiece(p, b) {
//         const weights = computeQTab(b, p);
//         interface Out { cell: number; x: number; y: number };
//         const out: Out = weights.reduce((last: Out | null, nrow, x) => {
//             const best: Out = nrow.reduce( (lc: Out | null, cell, y) => {
//                 if ( (lc === null) || (lc.cell < cell) ) return {cell, x, y};
//                 if ( lc.cell === cell ) {
//                     if( Math.random() > (0.5 + Math.random()*Math.random()) ) {
//                         return lc; 
//                     }  else  {
//                         return {cell, x, y};
//                     }
//                 }
//                 return lc; 
//             } , null)
//             if( (last === null) || (last.cell < best.cell) ) return best;
//             return last;
//         }, null);
//         // console.log("giving", out, weights);
//         return { x: out.x, y: out.y };
//     },
//     givePiece(u, b) {
//         interface Out { cell: number; x: number; y: number };
//         const out = u.map( (p, i) => {
//             if (p !== null ) {
//                 const qtab = computeQTab(b, p);
//                 // console.log("checking", {...p}, qtab);
//                 return {
//                     i,
//                     val: qtab.reduce((last: Out | null, nrow, x) => {
//                         const best: Out = nrow.reduce( (lc: Out | null, cell, y) => {
//                             if ( (lc === null) || (lc.cell < cell) ) return {cell, x, y};
//                             return lc; 
//                         } , null)
//                         if( (last === null) || (last.cell < best.cell) ) return best;
//                         if ( (last.cell === best.cell) && (Math.random() < 0.5) ) return best; 
//                         return last;
//                     }, null)
//                 }
//             }   else    {
//                 return {i, val: {cell: 100000}};
//             }
//         }).reduce( (last, incm) => {
//             if( last.val.cell < incm.val.cell ) {
//                 return last;
//             }   else    {
//                 return incm;
//             }
//         } )
//         // console.log(out);
//         return out.i;
//     }
// }

function makeAIFromQTab(compQTable: (b: BoardGamePieces, p: GamePieceOptions) => number[][]) : AIPlayer {
    return {
        placePiece(p, b) {
            const weights = compQTable(b, p as GamePieceOptions);
            interface Out { cell: number; x: number; y: number };
            const out: Out = weights.reduce((last: Out | null, nrow, x) => {
                const best: Out = nrow.reduce( (lc: Out | null, cell, y) => {
                    if ( (lc === null) || (lc.cell < cell) ) return {cell, x, y};
                    if ( lc.cell === cell ) {
                        if( Math.random() < 0.25 ) {
                            return lc; 
                        }  else  {
                            return {cell, x, y};
                        }
                    }
                    return lc; 
                } , null)
                if( (last === null) || (last.cell < best.cell) ) return best;
                return last;
            }, null);
            // console.log("giving", out, weights);
            return { x: out.x, y: out.y };
        },
        givePiece(u, b) {
            interface Out { cell: number; x: number; y: number };
            const out = u.map( (p, i) => {
                if (p !== null ) {
                    const qtab = compQTable(b, p);
                    // console.log("checking", {...p}, qtab);
                    return {
                        i,
                        val: qtab.reduce((last: Out | null, nrow, x) => {
                            const best: Out = nrow.reduce( (lc: Out | null, cell, y) => {
                                if ( (lc === null) || (lc.cell < cell) ) return {cell, x, y};
                                return lc; 
                            } , null)
                            if( (last === null) || (last.cell < best.cell) ) return best;
                            if ( (last.cell === best.cell) && (Math.random() < 0.5) ) return best; 
                            return last;
                        }, null)
                    }
                }   else    {
                    return {i, val: {cell: 100000}};
                }
            }).reduce( (last, incm) => {
                if( last.val.cell < incm.val.cell ) {
                    return last;
                }   else    {
                    return incm;
                }
            } )
            // console.log(out);
            return out.i;
        }
    }
}

function zeros() {
    return [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ]
}

function computeQTab(b: BoardGamePieces, p: GamePieceOptions, nullValue = -10000) {
    const weights = zeros();
    const keys: Array<keyof GamePieceOptions> = ["black", "circle", "hole", "tall"];

    function updateWeight(x: number, y: number, numOfMatches: number) {
        if(numOfMatches !== 0) {
            weights[x][y] += Math.pow(10, numOfMatches)
        }
    }
    const diagLMatched: Record<keyof GamePieceOptions, number> = {
        "black": 0, "circle": 0, "hole": 0, "tall": 0,
    };
    const diagRMatched: Record<keyof GamePieceOptions, number> = {
        "black": 0, "circle": 0, "hole": 0, "tall": 0,
    };
    for (let x = 0; x < 4; x++) {
        const rowMatched: Record<keyof GamePieceOptions, number> = {
            "black": 0, "circle": 0, "hole": 0, "tall": 0,
        };
        const colMatched: Record<keyof GamePieceOptions, number> = {
            "black": 0, "circle": 0, "hole": 0, "tall": 0,
        };
        for (let y = 0; y < 4; y++) {
            keys.forEach( key => {
                if( b[x][y] !== null ) {
                    rowMatched[key] += b[x][y][key] === p[key] ? 1 : 0;
                    weights[x][y] = nullValue;
                }
                if( b[y][x] !== null ) {
                    colMatched[key] += b[y][x][key] === p[key] ? 1 : 0;
                }
            } );
        };
        for (let y = 0; y < 4; y++) {
            keys.forEach( key => {
                if( b[x][y] === null ) {
                    updateWeight(x, y, rowMatched[key])
                }
                if( b[y][x] === null ) {
                    updateWeight(y, x, colMatched[key])
                }
            });
        };
        const y1 = 3 - x;
        const y2 = x;
        keys.forEach( key => {
            if( b[x][y1] !== null) {
                diagLMatched[key] += b[x][y1][key] === p[key] ? 1 : 0;
            } 
            if( b[x][y2] !== null) {
                diagRMatched[key] += b[x][y2][key] === p[key] ? 1 : 0;
            } 
        } );
    };
    for (let x = 0; x < 4; x++) {
        const y1 = 3 - x;
        const y2 = x;
        keys.forEach( key => {
            if( b[x][y1] === null ) {
                updateWeight(x, y1, diagLMatched[key])
            }
            if( b[y2][x] === null ) {
                updateWeight(x, y2, diagLMatched[key])
            }
        });
    };
    return weights
}

function computeQTab2(b: BoardGamePieces, p: GamePieceOptions, nullValue = -10000) {
    return updateSplitWeights(b, p, computeQTab(b, p, null));
}

function updateSplitWeights(b: BoardGamePieces, p: GamePieceOptions, weights: number[][]) {
    const keys: Array<keyof GamePieceOptions> = ["black", "circle", "hole", "tall"];

    keys.forEach( key => {
        const matches = countMatches(key, b, p[key]);
        const opmatches = countMatches(key, b, !p[key]);
        const nearOp = [...opmatches.cols, ...opmatches.rows, opmatches.diagL, opmatches.diagR].filter( n => n === 3);
        if (nearOp.length > 0) {
            matches.rows.forEach( (v, x) => {
                if( v === 2 ) {
                    weights[x] = [0, 0, 0, 0];
                }
                if (matches.cols[x] === 2) {
                    for (let i = 0; i < 3; i++) {
                        weights[x][i] = 0;                        
                    }
                }
            } );
            if ( matches.diagL === 2 ) {
                for (let i = 0; i < 3; i++) {
                    weights[i][3 - i] = 0;                        
                }
            }
            if ( matches.diagR === 2 ) {
                for (let i = 0; i < 3; i++) {
                    weights[i][i] = 0;                        
                }
            }
        }
    });
    
    return weights;
}

function countMatches(key: keyof GamePieceOptions, b: BoardGamePieces, val: boolean) {
    const [rows, cols, ..._] = zeros();
    let [diagL, diagR] = [0, 0];
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if( b[x][y] !== null ) {
                rows[x] += b[x][y][key] === val ? 1 : 0;
            }
            if( b[y][x] !== null ) {
                cols[y] += b[y][x][key] === val ? 1 : 0;
            }
        };
        const y1 = 3 - x;
        const y2 = x;
        if( b[x][y1] !== null) {
            diagL += b[x][y1][key] === val ? 1 : 0;
        } 
        if( b[x][y2] !== null) {
            diagR += b[x][y2][key] === val ? 1 : 0;
        } 
    };
    return { rows, cols, diagL, diagR };
}
