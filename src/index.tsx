import * as React from "react";
import { render } from "react-dom";
import * as bdetect from "detect-browser";

const binfo = bdetect.detect();
const requiredVersions: any = {
    "chromium-webview": "57.0",
    "chrome": "57.0",
    "edge": "16.0",
    "firefox": "52.0",
    "safari": "10",
    "opera": "44",
    "ios": "10.0"
};

(async () => {
    let App = <>
        <h1>Invalid Browser</h1>
        <a href="https://updatemybrowser.org/">Please install a modern browser.</a>
    </>;
    if ( binfo ) {
        const rversion: string = requiredVersions[binfo.name];
        if ( rversion ) {
            if ( binfo.version > rversion ) {
                const TextBanner = (await import("~/components/TextBanner")).default;
                const Modal = (await import("~/components/Modal")).default;
                const AppRouter = (await import("~/router")).default;
                App = <>
                    <Modal/>
                    <TextBanner/>
                    <AppRouter/>
                </>;
            }   else    {
                App = <>
                    <h1>Please update browser</h1>
                    <p>
                        Current: {binfo.name} {binfo.version} <br/>
                        Requires: {binfo.name} {rversion}+
                    </p>
                    <a href="https://updatemybrowser.org/">Please update your browser.</a>
                </>;
            }
        }   else    {
            App = <>
                <h1>Invalid browser</h1>
                <p>
                    Current: {binfo.name} {binfo.version} <br/>
                    Requires: <a href="https://updatemybrowser.org/">Modern Browser</a>
                </p>
            </>;
        }
    }
    render(App, document.getElementById("app"));
})()
