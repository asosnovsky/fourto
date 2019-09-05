import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";

import secrets from "~/config/_secrets";
import { randSentence } from './random';
import { getCookie, setCookie } from './cookie';

const app = firebase.initializeApp(secrets.firebase)
const database = app.database();

export default app;
export const sphrasedb = database.ref('/sphrases');
export const logdb = database.ref("/logs");
export const aliasdb = database.ref("/aliases");
export const gamedb = app.firestore().collection("games");
export const auth = app.auth();


let uid: string;
let sphrase: string;

export const getUID = async () => {
    if (!uid) {
        uid = (await auth.signInAnonymously()).user.uid;
    }
    return uid;
}

export const getSecretPhrase = async () => {
    if (!sphrase) {
        const uid = await getUID();
        const tmp = (await sphrasedb.child(`/utp/${uid}`).once('value')).val();
        if(tmp === null) {
            sphrase = await genSecPhrase(uid);
        }   else    {
            await sphrasedb.child(`/ptu/${tmp}`).set(uid);
            sphrase = tmp;
        }
    }
    return sphrase;
}

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

async function genSecPhrase(uid: string): Promise<string> {
    const tmp = randSentence();
    const exists = (await sphrasedb.child(`/ptu/${tmp}`).once('value')).val();
    if (exists === null) {
        await Promise.all([
            sphrasedb.child(`/ptu/${tmp}`).set(uid),
            sphrasedb.child(`/utp/${uid}`).set(tmp),
        ]);
        return tmp;
    }   else    {
        return genSecPhrase(uid);
    }
}

async function removeSphrases() {
    // if (sphrase) {
    //     await Promise.all([
    //         sphrasedb.child(`/ptu/${sphrase}`).remove(),
    //         sphrasedb.child(`/utp/${uid}`).remove(),
    //     ]);
    // }
    // return true;
}
window.addEventListener("unload", removeSphrases)
window.addEventListener("beforeunload", removeSphrases)
auth.onAuthStateChanged( d => {
    if ( !d.uid ) {
        removeSphrases();
    }
} );