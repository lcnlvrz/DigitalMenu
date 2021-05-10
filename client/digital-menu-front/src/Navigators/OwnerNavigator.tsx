import React from 'react';
import { Layout, Menu, Spin } from 'antd';
import { Header } from '../components/Header';
import { MyMenus } from '../pages/MyMenus/MyMenus';
import { MyRestaurant } from '../pages/MyRestaurant/MyRestaurant';
import { ModalCreateRestaurant } from '../components/ModalCreateRestaurant/ModalCreateRestaurant';
import {
    BankOutlined,
    UnorderedListOutlined,
    CustomerServiceOutlined,
    MenuOutlined,
    FormOutlined,
    NotificationOutlined,
    AreaChartOutlined,
    UserOutlined,
    TableOutlined,
} from '@ant-design/icons';
import { useOwnerNavigator } from '../controllers/owner-navigator.controller';
import MyCustomers from '../pages/MyCustomers/MyCustomers';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Switch } from 'react-router-dom';
import ProfileInformation from '../pages/ProfileInformation/ProfileInformation';
import { UserRoles } from '../interfaces/User';
import SurveyFormNavigator from './SurveyFormNavigator';
import Campaingsv2 from '../pages/CampaignsV2/Campaingsv2';
import Reports from '../pages/Reports/Reports';
import Tables from '../pages/Tables/Tables';
import { Helmet } from 'react-helmet-async';

export const OwnerNavigator = (props: RouteComponentProps): JSX.Element => {
    const controller = useOwnerNavigator();

    if (controller.user.isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    if (!controller.user.isLoading && controller.user.role?.[0] !== UserRoles.OWNER) {
        return <Redirect to="/auth/login" />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Sider className="500:hidden" defaultCollapsed collapsible>
                <Menu
                    theme="dark"
                    selectable
                    onSelect={(info) => {
                        const path = info.key as string;
                        controller.history.push(path);
                    }}
                    selectedKeys={[
                        location.pathname.indexOf('/dashboard/survey-forms') !== -1
                            ? '/dashboard/survey-forms'
                            : location.pathname,
                    ]}
                    mode="inline"
                >
                    <Menu.Item key="/dashboard" icon={<MenuOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item icon={<BankOutlined />} key="/dashboard/my-restaurant">
                        My Restaurant
                    </Menu.Item>
                    <Menu.Item icon={<UnorderedListOutlined />} key="/dashboard/my-menus">
                        My Menus
                    </Menu.Item>
                    <Menu.Item icon={<CustomerServiceOutlined />} key="/dashboard/my-customers">
                        My Customers
                    </Menu.Item>
                    <Menu.Item icon={<FormOutlined />} key="/dashboard/survey-forms">
                        Survey Forms
                    </Menu.Item>
                    <Menu.Item icon={<NotificationOutlined />} key="/dashboard/campaigns">
                        Campaigns
                    </Menu.Item>
                    <Menu.Item icon={<AreaChartOutlined />} key="/dashboard/reports">
                        Reports
                    </Menu.Item>
                    <Menu.Item icon={<TableOutlined />} key="/dashboard/tables">
                        Tables
                    </Menu.Item>
                    <Menu.Item icon={<UserOutlined />} key="/dashboard/profile-information">
                        Profile Information
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout className="site-layout">
                <Header />
                <Layout.Content>
                    <ModalCreateRestaurant />
                    <Switch>
                        <Route key="1" path={props.match.url + '/my-restaurant'}>
                            <Helmet>
                                <title> Digital Menu - My Restaurant Profile </title>
                            </Helmet>
                            <MyRestaurant />
                        </Route>
                        <Route key="2" path={props.match.url + '/my-customers'}>
                            <Helmet>
                                <title> Digital Menu - My Customers </title>
                            </Helmet>
                            <MyCustomers />
                        </Route>
                        <Route key="3" path={props.match.url + '/my-menus'}>
                            <Helmet>
                                <title> Digital Menu - My Menus </title>
                            </Helmet>
                            <MyMenus />
                        </Route>
                        <Route key="4" path={props.match.url + '/profile-information'}>
                            <Helmet>
                                <title> Digital Menu - Profile Information </title>
                            </Helmet>
                            <ProfileInformation />
                        </Route>
                        <Route key="5" path={props.match.url + '/survey-forms'}>
                            <Helmet>
                                <title> Digital Menu - Profile Information </title>
                            </Helmet>
                            <SurveyFormNavigator />
                        </Route>
                        <Route key="6" path={props.match.url + '/campaigns'}>
                            <Helmet>
                                <title> Digital Menu - Campaings </title>
                            </Helmet>
                            <Campaingsv2 />
                        </Route>
                        <Route key="7" path={props.match.url + '/reports'}>
                            <Helmet>
                                <title> Digital Menu - Reports </title>
                            </Helmet>
                            <Reports />
                        </Route>
                        <Route key="8" path={props.match.url + '/tables'}>
                            <Helmet>
                                <title> Digital Menu - Tables </title>
                            </Helmet>
                            <Tables />
                        </Route>
                        <Route key="9">
                            <Helmet>
                                <title> Digital Menu - Dashboard </title>
                            </Helmet>
                            <Dashboard />
                        </Route>
                    </Switch>
                </Layout.Content>
            </Layout>
        </Layout>
    );
};
