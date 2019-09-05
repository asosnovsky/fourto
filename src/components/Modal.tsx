import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

import "./Modal.scss";
import { nameState } from '~/state/name';

class ModalState {
    @observable show = false;
    @observable msg = () => <>n/a</>;
    @observable onunload: () => void;

    @action ask(msg: () => JSX.Element, onunload = () => {}) {
        this.msg = msg;
        this.show = true;
        this.onunload = onunload;
    }
}
export const modalState = new ModalState();
export default observer(function Modal () {
    return <div className="modal" style={{ 
            opacity: modalState.show ? 1 : 0,
            top: modalState.show ? '0' : -1000,
        }}>
        <div className="modal-background" onClick={() => {
            modalState.show = false;
            if(modalState.onunload) modalState.onunload()
        }}></div>
        <div className="modal-content">
            <modalState.msg key="content"/>
        </div>
    </div>
});