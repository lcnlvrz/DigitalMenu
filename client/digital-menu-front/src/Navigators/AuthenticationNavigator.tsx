import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { UserRoles } from '../interfaces/User';
import { Login } from '../pages/Login/Login';
import NotFoundContent from '../pages/NotFoundContent/NotFoundContent';
import { Register } from '../pages/Register/Register';
import ChangePassword from '../pages/ResetPassword/ChangePassword/ChangePassword';
import SendMailPassword from '../pages/ResetPassword/SendMailPassword/SendMailPassword';
import { RootState } from '../redux/reducers/root-state.reducer';

const AuthenticationNavigator = (props: RouteComponentProps) => {
    const user = useSelector((state: RootState) => state.user);

    if (!user.isLoading && user.role?.[0] === UserRoles.OWNER) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Switch>
            <Route path={props.match.url + '/login'} exact>
                <Helmet>
                    <title> Digital Menu - Login </title>
                </Helmet>
                <Login />
            </Route>
            <Route path={props.match.url + '/register'} exact>
                <Helmet>
                    <title> Digital Menu - Register </title>
                </Helmet>
                <Register />
            </Route>
            <Route path={props.match.url + '/send-mail-password'} exact>
                <Helmet>
                    <title> Digital Menu - Retrieve Password </title>
                </Helmet>
                <SendMailPassword />
            </Route>
            <Route path={props.match.url + '/change-password'} exact>
                <Helmet>
                    <title> Digital Menu - Change Password </title>
                </Helmet>
                <ChangePassword />
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

export default AuthenticationNavigator;
