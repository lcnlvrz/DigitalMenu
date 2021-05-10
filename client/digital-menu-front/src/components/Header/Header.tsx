import React from 'react';
import { Layout, Avatar, Tooltip, Typography, Dropdown, Divider, Drawer, Menu } from 'antd';
import { Logo } from '../Logo/Logo';
import {
    AreaChartOutlined,
    BankOutlined,
    CustomerServiceOutlined,
    EyeOutlined,
    FormOutlined,
    LogoutOutlined,
    MenuOutlined,
    NotificationOutlined,
    TableOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './Header.css';
import { Link } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import { useHeader } from '../../controllers/header.controller';
import { CgMenu } from 'react-icons/cg';
import { useMediaQuery } from 'react-responsive';

export const Header = (): JSX.Element => {
    const controller = useHeader();

    const isMax500 = useMediaQuery({ maxWidth: '500px' });

    const dropdownOverlay = (
        <div className="rounded-lg flex flex-col items-start">
            <div className="flex flex-row w-full items-center space-x-3 bg-red-500 rounded-tr-2xl rounded-tl-2xl p-5">
                <Avatar
                    style={{ width: '2.5rem', height: '2.5rem' }}
                    size="large"
                    src={
                        controller.restaurant.profilePhoto ||
                        'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                    }
                />
                <div className="flex flex-col space-x-4">
                    <Typography.Paragraph
                        className="font-semibold"
                        style={{ margin: 0, color: 'white' }}
                        ellipsis={{ rows: 1 }}
                    >
                        {' '}
                        {controller.user.firstName + ' ' + controller.user.lastName}{' '}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                        className="font-semibold"
                        style={{ margin: 0, color: '#E5E7EB' }}
                        ellipsis={{ rows: 1 }}
                    >
                        {controller.user.email}
                    </Typography.Paragraph>
                </div>
            </div>
            <section className="flex flex-col bg-white p-5 w-full border-br-2xl rounded-b-2xl space-y-4">
                <Link to="/dashboard/profile-information">
                    <div className="flex flex-row space-x-3 items-center hover-red-children cursor-pointer">
                        <FaUserTie className="text-2xl text-gray-500 element-hover-red transition-all" />
                        <span className="text-gray-500 element-hover-red transition-all">Account Settings</span>
                    </div>
                </Link>
                <Divider />
                <div className="w-full text-center">
                    <button
                        onClick={controller.logout}
                        className="text-red-500 px-3 py-1 rounded-2xl border border-opacity-50 border-gray-400 hover:border-opacity-100 hover:bg-gray-100 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </section>
        </div>
    );

    return (
        <Layout.Header
            style={{ padding: '20px', position: isMax500 ? 'sticky' : 'unset', width: '100%', top: 0, zIndex: 100 }}
            className="flex flex-row items-center justify-between p-0"
        >
            <div className="flex flex-row items-center space-x-3">
                <Logo textClassName="text-white text-sm" logoClassName="text-white text-3xl" />
                <div className="500:hidden">
                    <Tooltip title="See Restaurant as Customer">
                        <Link to={'/restaurant/profile?id=' + controller.restaurant.id + '&as_restaurant=true'}>
                            <EyeOutlined className="transition-all header-icon" />
                        </Link>
                    </Tooltip>
                </div>
            </div>
            <Dropdown className="500:hidden" trigger={['click']} overlay={dropdownOverlay}>
                <section className="flex flex-row space-x-3 items-center hover-parent cursor-pointer">
                    <Typography.Paragraph className="font-semibold" style={{ color: '#9CA3AF', margin: 0 }}>
                        {' '}
                        Hi,{' '}
                        <span className="text-white hover-children cursor-pointer transition-all">
                            {controller.user.firstName + ' ' + controller.user.lastName}
                        </span>{' '}
                    </Typography.Paragraph>
                    <Avatar
                        style={{ width: '2.5rem', height: '2.5rem' }}
                        size="large"
                        src={
                            controller.restaurant.profilePhoto ||
                            'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                        }
                    />
                </section>
            </Dropdown>
            <CgMenu
                onClick={() => controller.setVisibleDrawer(true)}
                className="text-white text-2xl hidden 500:block cursor-pointer hover:text-gray-300 transition-all"
            />
            <Drawer
                maskClosable
                bodyStyle={{ padding: 0, zIndex: 1000, background: '#001529' }}
                headerStyle={{ display: 'none' }}
                onClose={() => controller.setVisibleDrawer(false)}
                visible={controller.visibleDrawer}
                placement="right"
            >
                <Menu
                    onSelect={(info) => {
                        const path = info.key as string;
                        if (path === 'logout') {
                            controller.logout();
                        } else {
                            controller.history.push(path);
                        }
                    }}
                    selectedKeys={[
                        location.pathname.indexOf('/dashboard/survey-forms') !== -1
                            ? '/dashboard/survey-forms'
                            : location.pathname,
                    ]}
                    theme="dark"
                    selectable
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
                    <Menu.Item
                        icon={<EyeOutlined />}
                        key={'/restaurant/profile?id=' + controller.restaurant.id + '&as_restaurant=true'}
                    >
                        See Restaurant as Customer
                    </Menu.Item>
                    <Menu.Item icon={<LogoutOutlined />} key="logout">
                        Logout
                    </Menu.Item>
                </Menu>
            </Drawer>
        </Layout.Header>
    );
};
