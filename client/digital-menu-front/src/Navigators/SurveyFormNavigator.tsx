import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, RouteComponentProps, Switch, useRouteMatch } from 'react-router-dom';
import CreateSurveyForm from '../pages/SurveyForms/CreateSurveyForm/CreateSurveyForm';
import EditSurveyForm from '../pages/SurveyForms/EditSurveyForm/EditSurveyForm';
import ResponsesSurveyForm from '../pages/SurveyForms/ResponsesSurveyForm/ResponsesSurveyForm';
import SurveyFormCards from '../pages/SurveyForms/SurveyFormCards/SurveyFormCards';
import SurveyFormOptionsNavigator from '../pages/SurveyForms/SurveyFormOptionsNavigator/SurveyFormOptionsNavigator';
import '../pages/SurveyForms/SurveyForms.css';

const SurveyFormNavigator = () => {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={url + '/create'}>
                <Helmet>
                    <title> Digital Menu - Create Survey Form </title>
                </Helmet>
                <CreateSurveyForm />
            </Route>
            <Route path={url + '/edit'}>
                <Helmet>
                    <title> Digital Menu - Edit Survey Form </title>
                </Helmet>
                <EditSurveyForm />
            </Route>
            <Route path={url + '/created'}>
                <Helmet>
                    <title> Digital Menu - Create Survey Form </title>
                </Helmet>
                <SurveyFormCards />
            </Route>
            <Route path={url + '/responses'}>
                <Helmet>
                    <title> Digital Menu - Feedback Results </title>
                </Helmet>
                <ResponsesSurveyForm />
            </Route>
            <Route>
                <Helmet>
                    <title> Digital Menu - Survey Forms </title>
                </Helmet>
                <SurveyFormOptionsNavigator />
            </Route>
        </Switch>
    );
};

export default SurveyFormNavigator;
