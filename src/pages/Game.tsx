import * as React from "react";

import Board from "~/components/Board";
import OpenPieces from "~/components/OpenPieces";
import Navbar from "~/components/Navbar";

import "./Game.scss";

export default () => <div id="game-page">
    <Board/>
    <OpenPieces/>
    <Navbar/>
</div>;