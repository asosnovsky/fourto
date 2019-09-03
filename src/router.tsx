import * as React from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";

// import ErrorBoundary from "~/components/common/ErrorBoundary";
import LocalMultiplayerPage from "~/pages/LocalMultiplayer";
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import SinglePlayerGamePage from './pages/SinglePlayerGame';
import OnlineMultiplayerSetupPage from './pages/OnlineMultiplayerSetup';
import OnlineMultiplayerPage from './pages/OnlineMultiplayer';

export const history = createBrowserHistory();

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <MainPage path="/" exact/>
                    <LocalMultiplayerPage path="/local-multiplayer"/>
                    <SinglePlayerGamePage path="/singleplayer"/>
                    <OnlineMultiplayerSetupPage path="/online" exact/>
                    <Route path="/online/:gameid" excat component={OnlineMultiplayerPage}/>
                    <NotFoundPage path="*"/>
                </Switch>
            </Router>
        );
    }
}
