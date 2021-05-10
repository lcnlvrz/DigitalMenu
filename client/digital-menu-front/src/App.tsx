import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { OwnerNavigator } from './Navigators/OwnerNavigator';
import CustomerOrderPortal from './pages/CustomerOrderPortal/CustomerOrderPortal';
import AuthenticationNavigator from './Navigators/AuthenticationNavigator';
import CustomerNavigator from './Navigators/CustomerNavigator';
import LandingPage from './pages/LandingPage/LandingPage';
import NotFoundContent from './pages/NotFoundContent/NotFoundContent';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/auth" component={AuthenticationNavigator} />
                <Route path="/restaurant" component={CustomerNavigator} />
                <Route path="/" exact={true} component={LandingPage} />
                <Route path="/order" component={CustomerOrderPortal} />
                <Route path="/dashboard" component={OwnerNavigator} />
                <Route component={NotFoundContent} />
            </Switch>
        </Router>
    );
}

export default App;
