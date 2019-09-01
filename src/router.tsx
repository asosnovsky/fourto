import * as React from "react";
import { Router, Switch } from "react-router";
import { createBrowserHistory } from "history";

// import ErrorBoundary from "~/components/common/ErrorBoundary";
import GamePage from "~/pages/Game";
import NotFoundPage from './pages/NotFoundPage';

export const history = createBrowserHistory();

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <GamePage path="/"/>
                    <NotFoundPage path="*"/>
                </Switch>
            </Router>
        );
    }
}
