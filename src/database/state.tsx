import * as React from "react";
import { auth, gamedb, aliasdb } from './basis';
import { sphrasedb } from '.';
import { randSentence } from '~/random';
import { modalState } from '~/components/Modal';
import moment = require('moment');
import { history } from '~/router';

let uid: string;
let sphrase: string;
let gamelistener: () => void;

async function cleanUp() {
    gamelistener();
    // if (sphrase) {
    //     await Promise.all([
    //         sphrasedb.child(`/ptu/${sphrase}`).remove(),
    //         sphrasedb.child(`/utp/${uid}`).remove(),
    //     ]);
    // }
    // return true;
}
window.addEventListener("unload", cleanUp)
window.addEventListener("beforeunload", cleanUp)
auth.onAuthStateChanged( d => {
    if ( !d && uid ) {
        cleanUp();
        window.location.reload(true);
    }
} );

// Public Functions

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

export const getUID = async () => {
    if (!uid) {
        uid = (await auth.signInAnonymously()).user.uid;
        startGameListener();
    }
    return uid;
}

// Private Functions

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
function startGameListener() {
    gamelistener = gamedb.where(`users`, 'array-contains', uid).
    where('winState.won', '==', false).
    where('started', ">=" , Date.now() - 24*60*60*1000).
    orderBy('started', "desc").
    limit(1).
    onSnapshot( async snap => {
        if( !(
            (history.location.pathname.indexOf("/online/") === 0) ||
            (history.location.pathname.indexOf("/local-multiplayer") === 0)
        ) && (snap.docs.length > 0) ) {
            const game = snap.docs[0];
            const gameData = game.data();
            const ouid = (gameData["users"] as string[]).filter( u => u !== uid )[0];
            const opName = (await aliasdb.child(ouid).once('value')).val();
            console.log(gameData, opName);
            modalState.ask( () => <>
                <div className="modal-content-inner">
                    <p style={{textAlign: "center"}}>
                        <b>{opName}</b> has invited you to a game {moment(gameData["started"]).fromNow()}! 
                        <br/><br/>
                        Would you like to accept?
                    </p>
                </div>
                <div className="modal-content-btns">
                    <button className="green" onClick={() => {
                        history.push("/online/" + game.id);
                        modalState.show = false;
                    }}>Accept</button>
                    <button className="red" onClick={() => {
                        modalState.show = false;
                    }}>Ignore</button>
                </div>
            </> );
        }
    });
}
