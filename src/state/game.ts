import { observable, action, computed } from "mobx";

import { GamePieceOptions } from "~/components/GamePiece";
import { bannerState } from '~/components/TextBanner';
import { logdb, getUID, aliasdb } from "~/database/index";
import { nameState } from './name';

export type GameWinState = {
    won: false;
} | {
    won: true;
    wtype: "h" | "v"
    wref: number;
} | {
    won: true;
    wtype: "l" | "r";
}
export type GamePieceInSpot = GamePieceOptions | null;
export type GamePieceList = GamePieceInSpot[];
export type BoardGamePieces = GamePieceInSpot[][];
export type PlayerId = 0 | 1;
export type GameStateStage = "select-piece" | "place-piece" | "end";

const stringifyGamePiece = (gp: GamePieceInSpot) => {
    if (gp === null ) {
        return "----" 
    } else {
        return [gp["hole"], gp["circle"], gp["black"], gp["tall"]].map(Number).join("")
    };
}

export class GameState {
    @observable spots: BoardGamePieces = [];
    @observable gamePieces: GamePieceList = [];
    @observable stagePiece: number | null = null;
    @observable currentPlayer: PlayerId = Math.random() < 0.5 ? 0 : 1;
    @observable winState: GameWinState = { won: false };
    @observable lastPiece: number[] | null = null;
    @observable p1name: string;
    @observable p2name: string;

    private gameId: firebase.database.Reference;
    private currentTurn: number;

    @action async resetFromSnap(snapId: string, data: firebase.firestore.DocumentData) {
        let alreadyPlayed: string[] = [];
        this.spots = (data['state'] as string[]).map( row =>
            row.split("|").map( cell => {
                if (cell === "----") {
                    return null
                }   else    {
                    alreadyPlayed.push(cell);
                    const [hole, tall, circle, black] = cell.split("").map(n => n === "1");
                    return { hole, tall, circle, black };
                }
            } )
        );
        this.gamePieces = [];
        for (let n = 0; n < 16; n++) {
            const bin = n.toString(2).padStart(4, "0");
            if (alreadyPlayed.indexOf(bin) === -1) {
                const [hole, tall, circle, black] = bin.split("").map(n => n === "1");
                this.gamePieces.push({ hole, tall, circle, black });       
            }   else    {
                this.gamePieces.push(null);
                alreadyPlayed.push(null);
            }
        };
        this.currentTurn = alreadyPlayed.length;
        this.winState = data['winState'];
        this.lastPiece = data['lastPiece'];
        this.stagePiece = data['stagePiece'];

        const uid = await getUID();
        this.currentPlayer = data['current'] === uid ? 0 : 1;
        this.gameId = logdb.child(`${uid}/${snapId}${data['started']}`);
        this.p1name = nameState.p1name
        const ouid: string = (data["users"] as string[]).filter( u => u !== uid)[0]
        
        this.p2name = (await aliasdb.child(ouid).once('value')).val();

        if ( alreadyPlayed.length === 0 ) {
            bannerState.notify(`${this.currentPlayerName} starts the game!`, 3000);
        }
        return ouid;
    }
    @action reset(p1name: string, p2name: string) {
        this.spots = [];
        this.gamePieces = [];
        this.stagePiece = null;
        this.currentPlayer = Math.random() < 0.5 ? 0 : 1;
        this.winState = { won: false };
        this.lastPiece = null;
        this.gameId = undefined;
        this.currentTurn = 0;
        this.p1name = p1name;
        this.p2name = p2name;
        for (let _ = 0; _ < 4; _++) {
            this.spots.push([null, null, null, null]);            
        };
        for (let n = 0; n < 16; n++) {
            const [hole, tall, circle, black] = n.toString(2).padStart(4, "0").split("").map(n => n === "1");
            this.gamePieces.push({ hole, tall, circle, black });       
        };
        bannerState.notify(`${this.currentPlayerName} starts the game!`, 3000);
    }
    @action placeGamePiece(x: number, y: number) {
        if (this.stagePiece !== null) {
            this.log(`${this.currentPlayer}|p|${x},${y}`);
            const gp = this.gamePieces[this.stagePiece];
            this.gamePieces[this.stagePiece] = null;
            this.spots[x][y] = gp;
            this.lastPiece = [x,y,this.stagePiece];
            this.stagePiece = null;
            this.checkUpdateWin();
        }   else    {
            console.warn("stagePiece === null")
        }
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
    @action givePiece(i: number, resetFunc?: () => void) {
        if (this.stagePiece === null) {
            if (this.gamePieces[i] !== null) {
                this.log(`${this.currentPlayer}|g|${stringifyGamePiece(this.gamePieces[i])}`);
                this.stagePiece = i;
                this.switchPlayers();
            }   else    {
                bannerState.confirm(
                    "Err: G[stagePiece] !== null. Restart Game?", 
                    () => { 
                        if(resetFunc) resetFunc();
                        else this.reset(this.p1name, this.p2name)
                    }
                )
            }
        }else{
            console.warn("stagePiece !== null")
        }
    }
    @computed get currentStage() : GameStateStage {
        if (this.stagePiece === null) {
            return "select-piece"
        }   else if(!this.boardIsFull())  {
            return "place-piece"
        }   else    {
            return "end"
        }
    }
    @computed get currentPlayerName() : string {
        return this.currentPlayer === 0 ? this.p1name : this.p2name;
    }
    @computed get otherPlayerName() : string {
        return this.currentPlayer === 1 ? this.p1name : this.p2name;
    }
    toStateStrings(): string[] {
        return this.spots.map(
            row => row.map(
                cell => {
                    if (cell === null) {
                        return "----"
                    }   else    {
                        const { hole, tall, circle, black } = cell;
                        return [
                            hole, tall, circle, black
                        ].map(Number).join("")
                    }
                }
            ).join("|")
        )
    }
    private boardIsFull() : boolean {
        for (let i = 0; i < this.spots.length; i++) {
            for (let j = 0; j < this.spots[i].length; j++) {
                if (this.spots[i][j] === null) {
                    return false
                }
            }
        }
        return true
    }
    private async log(action: string) {
        if( !this.gameId ) {
            const uid = await getUID();
            this.gameId = await logdb.child(`/${uid}`).push([])
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
    }
    private checkUpdateWin() {
        this.winState = this.checkWin();
        if (this.winState.won) {
            console.log(this.spots.map(
                row => row.map(
                    c => c === null ? "----" : Object.keys(c).map( k=> Number(c[k]) ).join("") 
                ).join('|')
            ).join('\n'))
            this.log(`${this.currentPlayer}|w|${this.winState.wtype}|${this.winState.wref}`);
        }
    }
    private checkWin() : GameWinState {
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
                        return { won: true, wtype: 'v', wref: x };
                    }
                }
                if( n[1] === 4 ) {
                    if( (statsV[key] == 4) || (statsV[key] == 0) ) {
                        return { won: true, wtype: 'h', wref: x };
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
            return { won: false };
        }
        let key: keyof GamePieceOptions;
        for(key in stats1) {
            if (n[0] === 4) {
                if( (stats1[key] == 4) || (stats1[key] == 0) ) {
                    return { won: true, wtype: 'l' };
                }
            }
            if (n[1] === 4) {
                if( (stats2[key] == 4) || (stats2[key] == 0) ) {
                    return { won: true, wtype: 'r' };
                }
            }
        }
        return { won: false };
    }
}