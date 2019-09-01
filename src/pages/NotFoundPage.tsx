import * as React from "react";
import {Route} from "react-router";
import { history } from "~/router";

export default class NotFoundPage extends Route {
    public render() {
        return <div>
            <h3>404 Not Found</h3>
            <button onClick={() => history.push("/")}>Back</button>
        </div>
    }
}