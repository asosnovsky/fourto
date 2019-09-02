import * as React from "react";
import { Router, Switch } from "react-router";
import { createBrowserHistory } from "history";

// import ErrorBoundary from "~/components/common/ErrorBoundary";
import GamePage from "~/pages/Game";
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import SinglePlayerGamePage from './pages/SinglePlayerGame';

export const history = createBrowserHistory();

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <MainPage path="/" exact/>
                    <GamePage path="/local-multiplayer"/>
                    <SinglePlayerGamePage path="/singleplayer"/>
                    <NotFoundPage path="*"/>
                </Switch>
            </Router>
        );
    }
}
