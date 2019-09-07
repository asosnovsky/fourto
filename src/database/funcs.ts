import { setCookie, getCookie } from '~/cookie';
import { getUID } from './state';
import { aliasdb, gamedb } from './basis';
import { history } from '~/router';

export async function saveAliases(p1: string, p2?: string) {
    setCookie("p1name", p1, 10);    
    if (p2) setCookie("p2name", p2, 10);    
    await aliasdb.child(await getUID()).set(p1);
}

export function getAliases(): {p1: string, p2: string} {
    const out = {
        p1: getCookie("p1name") || "Player 1",
        p2: getCookie("p2name") || "Player 1",
    }
    saveAliases(out.p1, out.p1);
    return out;
} 

export async function createGameThenGoToIt(opuid: string) {
    const uid = await getUID();
    const update: any = {
        users: [
            uid, opuid,
        ],
        current: Math.random() > 0.5 ? uid : opuid,
        state: [
            '----|----|----|----',
            '----|----|----|----',
            '----|----|----|----',
            '----|----|----|----',
        ],
        piece: null,
        winState: { won: false },
        started: Date.now(),
        updated: Date.now(),
    };
    const r = await gamedb.add(update);
    history.push(`/online/${r.id}`);
    window.location.reload();
}

