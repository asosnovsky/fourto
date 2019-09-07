import * as React from "react";

export interface Props {
    msg: string;
    child?: JSX.Element;
}
export default function Tooltip(p: Props) {
    const [active, setActive] = React.useState(false);
    const Child = () => p.child || <div className="tooltip-qsm">?</div>;

    return <a className={active ? "tooltip active" : "tooltip"} onClick={() => setActive(!active)}>
        <Child/>
        <span className="tooltip-text" onClick={() => setActive(!active)}>{p.msg}</span>    
    </a>
};