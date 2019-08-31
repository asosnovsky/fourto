import { observable, action, computed } from "mobx";

import { GamePieceOptions } from "~/components/GamePiece";
import { bannerState } from '~/components/TextBanner';
import { database, getUID } from "~/database";
console.log(database)


class GameWinState {
    constructor(
        public won: boolean, 
        public wtype: "l" | "r" | "h" | "v" | null = null, 
        public wref: number | null = null
    ) {}
}

const stringifyGamePiece = (gp: GamePieceOptions | null) => {
    if (gp === null ) {
        return "----" 
    } else {
        return [gp["hole"], gp["circle"], gp["black"], gp["tall"]].map(Number).join("")
    };
}

class GameState {
    @observable spots: Array<Array<GamePieceOptions | null>> = [];
    @observable gamePieces: Array<GamePieceOptions | null> = [];
    @observable stagePiece: number | null = null;
    @observable currentPlayer: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    @observable winState: GameWinState = new GameWinState(false);

    private lastPiece: number[] | null = null;
    private gameId: firebase.database.Reference;
    private currentTurn: number;

    constructor() { this.reset(); }
    @action reset() {
        this.spots = [];
        this.gamePieces = [];
        this.stagePiece = null;
        this.currentPlayer = Math.random() < 0.5 ? 0 : 1;
        this.winState = new GameWinState(false);
        this.lastPiece = null;
        this.gameId = undefined;
        this.currentTurn = 0;
        for (let _ = 0; _ < 4; _++) {
            this.spots.push([null, null, null, null]);            
        };
        for (let n = 0; n < 16; n++) {
            const [hole, tall, circle, black] = n.toString(2).padStart(4, "0").split("").map(n => n === "1");
            this.gamePieces.push({ hole, tall, circle, black });       
        };
        bannerState.notify(`Player ${this.currentPlayer + 1} starts the game!`, 1500);
    }
    @action placeGamePiece(x: number, y: number) {
        this.log(`${this.currentPlayer}|p|${x},${y}`);
        const gp = this.gamePieces[this.stagePiece];
        this.gamePieces[this.stagePiece] = null;
        this.spots[x][y] = gp;
        this.lastPiece = [x,y,this.stagePiece];
        this.stagePiece = null;
        this.checkUpdateWin();
    }
    @action undo() {
        if (this.stagePiece !== null) {
            this.log(`${this.currentPlayer}|u|sp`);
            this.stagePiece = null;
            this.switchPlayers();
        }   else if (this.lastPiece !== null) {
            this.log(`${this.currentPlayer}|u|lp`);
            let [x, y, i] = this.lastPiece;
            this.gamePieces[i] = this.spots[x][y];
            this.spots[x][y] = null;
            this.stagePiece = i;
            this.lastPiece = null;
        }   else    {
            bannerState.notify("Undo is allowed only once!", 1000);
        }
    }
    @action givePiece(i: number) {
        if (this.stagePiece === null) {
            if (this.gamePieces[i] !== null) {
                this.log(`${this.currentPlayer}|g|${stringifyGamePiece(this.gamePieces[i])}`);
                this.stagePiece = i;
                this.switchPlayers();
            }   else    {
                bannerState.notify("Err: G[stagePiece] !== null", 5000)
            }
        }   else    {
            bannerState.notify("Err: stagePiece !== null", 5000)
        }
    }
    private async log(action: string) {
        if( !this.gameId ) {
            const uid = await getUID();
            this.gameId = await database.ref(`/logs/${uid}`).push([])
        }
        await this.gameId.child(String(this.currentTurn)).set(action);
        this.currentTurn += 1;
    }
    private switchPlayers() {
        if (this.currentPlayer === 0) {
            this.currentPlayer = 1;
        }   else {
            this.currentPlayer = 0;
        }
        bannerState.notify(`Player ${gameState.currentPlayer + 1} turn!`, 2000);
    }
    private checkUpdateWin() {
        this.winState = this.checkWin();
        if (this.winState.won) {
            console.log(this.winState);
            console.log(this.spots.map(
                row => row.map(
                    c => c === null ? "----" : Object.keys(c).map( k=> Number(c[k]) ).join("") 
                ).join('|')
            ).join('\n'))
            this.log(`${this.currentPlayer}|w|${this.winState.wtype}|${this.winState.wref}`);
        }
    }
    private checkWin() {
        type Stats = Record<keyof GamePieceOptions, number>; 
        const updateStats = (stats: Stats, v: GamePieceOptions) => {
            stats.hole += ( v.hole ? 1 : 0 );
            stats.circle += ( v.circle ? 1 : 0 );
            stats.tall += ( v.tall ? 1 : 0 );
            stats.black += ( v.black ? 1 : 0 );
        }
        let statsH: Stats;
        let statsV: Stats;
        for (let x = 0; x < 4; x++) {
            let broken = false;
            let n = [0, 0];
            statsH = { hole: 0, circle: 0, tall: 0, black: 0 };
            statsV = { hole: 0, circle: 0, tall: 0, black: 0 };
            for(let y = 0; y < 4; y++) {
                let v = this.spots[x][y];
                let h = this.spots[y][x];
                if ( (v === null) && (h === null) ) {
                    broken = true;
                    break;
                }   else    {
                    if ( v !== null ) { updateStats(statsV, v); n[1] += 1 }
                    if ( h !== null ) { updateStats(statsH, h); n[0] += 1 }
                }
            }
            if (broken) {
                continue;
            }
            let key: keyof GamePieceOptions;
            for(key in statsH) {
                if( n[0] === 4  ) {
                    if( (statsH[key] == 4) || (statsH[key] == 0) ) {
                        console.log(statsH);
                        return new GameWinState(true, 'v', x);
                    }
                }
                if( n[1] === 4 ) {
                    if( (statsV[key] == 4) || (statsV[key] == 0) ) {
                        console.log(statsV);
                        return new GameWinState(true, 'h', x);
                    }
                } 
            }
        }

        let n = [0, 0];
        let stats1: Stats = { hole: 0, circle: 0, tall: 0, black: 0 };
        let stats2: Stats = { hole: 0, circle: 0, tall: 0, black: 0 };
        for (let x = 0; x < 4; x++) {
            let s1 = this.spots[x][x];
            let s2 = this.spots[x][3-x];
            if ( s1 !== null ) { updateStats(stats1, s1); n[0] += 1; };
            if ( s2 !== null ) { updateStats(stats2, s2); n[1] += 1; };
        }
        if ( (n[0] === 0) && (n[1] === 0) ) {
            return new GameWinState(false, null, null);
        }
        let key: keyof GamePieceOptions;
        for(key in stats1) {
            if (n[0] === 4) {
                if( (stats1[key] == 4) || (stats1[key] == 0) ) {
                    return new GameWinState(true, 'l', null);
                }
            }
            if (n[1] === 4) {
                if( (stats2[key] == 4) || (stats2[key] == 0) ) {
                    return new GameWinState(true, 'r', null);
                }
            }
        }
        return new GameWinState(false, null, null);
    }
}

export const gameState = new GameState();