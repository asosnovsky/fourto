import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

import "./Modal.scss";

class ModalState {
    @observable show = false;
    @observable msg = () => <>n/a</>;

    @action ask(msg: () => JSX.Element) {
        this.msg = msg;
        this.show = true;
    }
}
export const modalState = new ModalState();
export default observer(function Modal () {
    return <div className="modal" onClick={() => {
        modalState.show = false;
    }} style={{ 
            opacity: modalState.show ? 1 : 0,
            top: modalState.show ? '0' : -1000,
        }}>
        <div className="modal-content">
            <modalState.msg key="content"/>
        </div>
    </div>
});