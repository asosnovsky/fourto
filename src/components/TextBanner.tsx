import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

import "./TextBanner.scss";

class BannerState {
    @observable show = false;
    @observable msg: string = "n/a";

    @action notify(msg: string, timeout: number = 1000) {
        this.msg = msg;
        this.show = true;
        window.setTimeout(() => {
            this.show = false;
        }, timeout);
    }
}
export const bannerState = new BannerState();
export default observer(() => {
    return <div className="text-banner" style={{ 
            // height: bannerState.show ? '25vh' : '0vh',
            // width: bannerState.show ? '100vw' : '0vw',
            opacity: bannerState.show ? 1 : 0,
            top: bannerState.show ? 0 : -1000,
        }}>
        <p>{bannerState.msg}</p>
        <div>
            <button onClick={() => {
                bannerState.show = false;
            }}>Okay</button>
        </div>
    </div>
});