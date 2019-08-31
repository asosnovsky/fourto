import * as React from "react";
import { render } from "react-dom";

import TextBanner from "~/components/TextBanner";
import GamePage from "~/pages/Game";

render(<>
    <TextBanner/>
    <GamePage/>
</>, document.getElementById("app"));
