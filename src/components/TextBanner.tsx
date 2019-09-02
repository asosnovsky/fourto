import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

import "./TextBanner.scss";

class BannerState {
    @observable show = false;
    @observable msg: string = "n/a";

    action: () => void;
    private lastNotif: number;

    @action notify(msg: string, timeout: number = 1000) {
        if (this.lastNotif !== undefined) {
            window.clearTimeout(this.lastNotif);
            this.lastNotif = undefined;
        }
        this.msg = msg;
        this.show = true;
        this.lastNotif = window.setTimeout(() => {
            this.show = false;
        }, timeout);
    }

    @action confirm(msg: string, onyes: () => void) {
        if (this.lastNotif !== undefined) {
            window.clearTimeout(this.lastNotif);
            this.lastNotif = undefined;
        }
        this.msg = msg;
        this.show = true;
        this.action = onyes;
    }
}
export const bannerState = new BannerState();
export default observer(function TextBanner () {
    return <div className="text-banner" style={{ 
            opacity: bannerState.show ? 1 : 0,
            top: bannerState.show ? '25vh' : -1000,
        }}>
        <p>{bannerState.msg}</p>
        <div>
            <button onClick={() => {
                bannerState.show = false;
                if(bannerState.action) {
                    bannerState.action();
                    bannerState.action = undefined;
                }
            }}>Okay</button>
            {(bannerState.action !== undefined) && <button onClick={() => {
                bannerState.show = false;
                bannerState.action = undefined
            }}>Cancel</button>}
        </div>
    </div>
});