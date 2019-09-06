import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";

import secrets from "~/config/_secrets";

const app = firebase.initializeApp(secrets.firebase)
const database = app.database();

export default app;
export const sphrasedb = database.ref('/sphrases');
export const logdb = database.ref("/logs");
export const aliasdb = database.ref("/aliases");
export const gamedb = app.firestore().collection("games");
export const auth = app.auth();

