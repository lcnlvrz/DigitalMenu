import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import CustomerOrderPortal from '../pages/CustomerOrderPortal/CustomerOrderPortal';
import NotFoundContent from '../pages/NotFoundContent/NotFoundContent';
import { RestaurantPublicProfile } from '../pages/RestaurantPublicProfile/RestaurantPublicProfile';

const CustomerNavigator = (props: RouteComponentProps) => {
    return (
        <Switch>
            <Route path={props.match.url + '/profile'}>
                <Helmet>
                    <title> Digital Menu - Restaurant Profile </title>
                </Helmet>
                <RestaurantPublicProfile />
            </Route>
            <Route path={props.match.url + '/order'}>
                <Helmet>
                    <title> Digital Menu - Order </title>
                </Helmet>
                <CustomerOrderPortal />
            </Route>
            <Route>
                <Helmet>
                    <title> Digital Menu - Not Found Page </title>
                </Helmet>
                <NotFoundContent />
            </Route>
        </Switch>
    );
};

export default CustomerNavigator;
