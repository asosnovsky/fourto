import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import secrets from "~/config/_secrets";

const app = firebase.initializeApp(secrets.firebase)

export default app;
export const database = app.database();
export const auth = app.auth();


let uid: string;

export const getUID = async () => {
    if (!uid) {
        uid = (await auth.signInAnonymously()).user.uid;
    }
    return uid;
}