import * as React from "react";
import { render } from "react-dom";

import TextBanner from "~/components/TextBanner";
// import GamePage from "~/pages/Game";
import AppRouter from "~/router";

render(<>
    <TextBanner/>
    <AppRouter/>
</>, document.getElementById("app"));
