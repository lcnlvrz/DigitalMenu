import { ArrowRightOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';
import React from 'react';
import { MdMoneyOff } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import './LandingPage.css';
import { InView } from 'react-intersection-observer';

const LandingPage = () => {
    const isMax850 = useMediaQuery({ minWidth: '850px' });
    const isMax800 = useMediaQuery({ minWidth: '800px' });
    const isMax600 = useMediaQuery({ minWidth: '600px' });

    const tableDesktop = (
        <table className="table-features fade-in w-full">
            <tbody>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/set-healthy-dishes_1308-28386.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> MENUS AND PLATES </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create your own menus and plates setting their title, description, ingredients
                                        and more stuff
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/resturant-building-background_23-2147667918.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RESTAURANT PROFILE </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Change photo, banner, description, schedule in one click and see it reflected in
                                        your profile
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/ordering-mexican-food-illustration_1284-23715.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> ORDER MANAGER </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Manage all your comming orders and concentrate essential information in one
                                        place.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/organic-flat-design-feedback-concept_23-2148943567.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> CUSTOMIZED FEEDBACK </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create custom survey forms and receive feedback about you want know
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/bloggers-advertising-referrals-young-people-with-gadgets-loudspeakers-announcing-news-attracting-target-audience-vector-illustration-marketing-promotion-communication_74855-8244.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RUN CAMPAINGS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Make campaings, test and combine these for test your customer traffic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/analysis-concept-illustration_114360-1119.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> WEEKLY ANALYSIS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        You have stadistics about your customers and sales for improve engineering.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const tableTablet = (
        <table className="table-features fade-in w-full">
            <tbody>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/set-healthy-dishes_1308-28386.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> MENUS AND PLATES </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create your own menus and plates setting their title, description, ingredients
                                        and more stuff
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/resturant-building-background_23-2147667918.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RESTAURANT PROFILE </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Change photo, banner, description, schedule in one click and see it reflected in
                                        your profile
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/organic-flat-design-feedback-concept_23-2148943567.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> CUSTOMIZED FEEDBACK </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create custom survey forms and receive feedback about you want know
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/bloggers-advertising-referrals-young-people-with-gadgets-loudspeakers-announcing-news-attracting-target-audience-vector-illustration-marketing-promotion-communication_74855-8244.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RUN CAMPAINGS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Make campaings, test and combine these for test your customer traffic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/ordering-mexican-food-illustration_1284-23715.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> ORDER MANAGER </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Manage all your comming orders and concentrate essential information in one
                                        place.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/analysis-concept-illustration_114360-1119.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> WEEKLY ANALYSIS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        You have stadistics about your customers and sales for improve engineering.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const tableMobile = (
        <table className="table-features fade-in w-full">
            <tbody>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/set-healthy-dishes_1308-28386.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> MENUS AND PLATES </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create your own menus and plates setting their title, description, ingredients
                                        and more stuff
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/resturant-building-background_23-2147667918.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RESTAURANT PROFILE </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Change photo, banner, description, schedule in one click and see it reflected in
                                        your profile
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/organic-flat-design-feedback-concept_23-2148943567.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> CUSTOMIZED FEEDBACK </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Create custom survey forms and receive feedback about you want know
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/bloggers-advertising-referrals-young-people-with-gadgets-loudspeakers-announcing-news-attracting-target-audience-vector-illustration-marketing-promotion-communication_74855-8244.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> RUN CAMPAINGS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Make campaings, test and combine these for test your customer traffic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/ordering-mexican-food-illustration_1284-23715.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> ORDER MANAGER </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        Manage all your comming orders and concentrate essential information in one
                                        place.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="w-full flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-5 w-56 h-full">
                                <img
                                    className="w-40 h-40 object-cover object-center rounded-full"
                                    src="https://image.freepik.com/free-vector/analysis-concept-illustration_114360-1119.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col space-y-2">
                                    <h3 className="font-semibold text-lg m-0"> WEEKLY ANALYSIS </h3>
                                    <p className="m-0 font-semibold text-gray-500">
                                        You have stadistics about your customers and sales for improve engineering.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const benefits = [
        {
            image:
                'https://image.freepik.com/free-photo/asian-man-barista-holding-tablet-checking-order-from-customer-coffee-cafe_1150-8047.jpg',
            title: 'Increase Revenue More Than 20%',
            items: ['Increased Table Turnover', 'Increased Ticket Size', 'Increased Tip Amounts'],
        },
        {
            image:
                'https://img.freepik.com/free-photo/smiling-waiter-using-digital-tablet-counter-cafa-c_1170-625.jpg?size=626&ext=jpg',
            title: 'Decrease Operational Costs by 30%',
            items: ['Eliminate Human Errors', 'Increased Labor Productivity', 'Low Maintenance'],
        },
        {
            image: 'https://image.freepik.com/free-photo/cheerful-bar-owner_1098-18045.jpg',
            title: 'Gain More Control Over Your Business',
            items: ['Real-Time Data', 'Data Analytics for Smarter Decisions', 'Update with One Click'],
        },
    ];

    const header = (
        <header
            style={{ zIndex: 1000 }}
            className="white-gradient w-full flex flex-row items-center  justify-between sticky top-0 p-5"
        >
            <div>
                <Logo textClassName="text-black font-semibold" logoClassName="text-black text-4xl" />
            </div>
            <ul className="flex flex-row items-center space-x-3">
                <li>
                    <Link to="/auth/login">
                        <button className="font-semibold text-blue-500 rounded-full p-2 hover:bg-blue-500 hover:bg-opacity-10 transition-all">
                            Login
                        </button>
                    </Link>
                </li>
                <li>
                    <Link to="/auth/login?demo=true">
                        <button className="bg-blue-500 rounded-full p-2 text-white font-semibold hover:bg-blue-800 transition-all">
                            Try Free Demo
                        </button>
                    </Link>
                </li>
            </ul>
        </header>
    );

    const presentation = (
        <div
            style={{ paddingTop: 0 }}
            id="presentation"
            className="w-full overflow-hidden items-start justify-center flex 800:flex-col-reverse p-10 pt-0 800:space-x-0 space-x-10 "
        >
            <section className="w-1/2 flex 800:w-full flex-col items-start space-y-5">
                <div className="flex flex-col items-start space-y-4">
                    <h1 className="font-bold text-6xl leading-tight m-0">
                        {' '}
                        Increase Your Revenue With
                        <br />
                        <span className="text-blue-500">Digital Menu</span>{' '}
                    </h1>
                    <p className="text-lg m-0 text-gray-500 font-semibold">
                        {' '}
                        Digital Menu helps you maximize your restaurant&apos;s ordering and organization by FREE CRM.
                    </p>
                </div>
                <div className="flex flex-col items-start space-y-4">
                    <Link to="/auth/login?demo=true">
                        <button className="bg-blue-500 space-x-3 rounded-full text-lg py-2 px-4 text-white font-semibold hover:bg-blue-800 transition-all">
                            <span>Try Free Demo</span>
                            <ArrowRightOutlined />
                        </button>
                    </Link>
                    <Link to="/auth/register">
                        <button className="font-semibold border border-blue-500 text-blue-500 rounded-full text-lg py-2 px-4 hover:bg-blue-500 hover:bg-opacity-10 transition-all">
                            Register
                        </button>
                    </Link>
                </div>
            </section>
            <div className="w-1/2 relative 800:w-full 800:space-x-10 800:items-center space-x-2 flex flex-row items-start">
                <img
                    style={{ transform: '', width: !isMax800 ? '18rem' : '23rem' }}
                    className="rounded-3xl mt-3 800:absolute z-30"
                    src="https://i.imgur.com/5nGJwdK.png"
                    alt=""
                />
                <div
                    style={{ width: '500px', transform: !isMax850 ? 'scale(0.6)' : '' }}
                    className="bg-blue-400  space-y-5 table bg-opacity-50 p-5 rounded-2xl border-blue-500 border-4"
                >
                    <button
                        style={{ width: 'fit-content' }}
                        className="bg-white shadow-lg flex flex-row space-x-5 items-center rounded-full p-3"
                    >
                        <span className="m-0 font-normal">Luciano&lsquo;s Restaurant</span>
                        <DownOutlined />
                    </button>
                    <div className="w-full flex flex-row space-x-5">
                        <section className="bg-white w-2/4 space-y-3 flex flex-col items-start shadow-lg rounded-2xl p-3">
                            <div className="flex w-full flex-row justify-between items-center">
                                <h3 className="m-0 text-lg font-normal"> Orders </h3>
                                <button className="flex bg-white rounded-full py-1 px-3 items-center border border-gray-400 flex-row space-x-3">
                                    <span> Today </span>
                                    <DownOutlined />
                                </button>
                            </div>
                            <p className="font-semibold text-3xl m-0"> $41478.00 </p>
                        </section>
                        <section className="bg-white w-2/4 space-y-3 flex flex-col items-start shadow-lg rounded-2xl p-3">
                            <div className="flex w-full flex-row justify-between items-center">
                                <h3 className="m-0 font-normal text-lg"> Avg/Order </h3>
                                <button className="flex bg-white rounded-full py-1 px-3 items-center border border-gray-400 flex-row space-x-3">
                                    <span> Today </span>
                                    <DownOutlined />
                                </button>
                            </div>
                            <p className="font-semibold text-3xl m-0"> $5457.5 </p>
                        </section>
                    </div>
                    <div className="bg-white p-5 flex flex-col rounded-2xl shadow-2xl z-30">
                        <div className="w-full flex flex-row items-center justify-between">
                            <h3 className="m-0">Orders</h3>
                            <button className="flex bg-white rounded-full py-1 px-3 items-center border border-gray-400 flex-row space-x-3">
                                <span> Today </span>
                                <DownOutlined />
                            </button>
                        </div>
                        <Table
                            style={{ margin: '1rem 0' }}
                            pagination={false}
                            scroll={{ x: 400 }}
                            className="components-table-demo-nested"
                            columns={[
                                {
                                    title: '#',
                                    dataIndex: 'order',
                                    key: 'order',
                                    align: 'center',
                                },
                                {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    key: 'name',
                                    align: 'center',
                                },
                                {
                                    title: 'Table',
                                    dataIndex: 'table',
                                    key: 'table',
                                    align: 'center',
                                },
                                {
                                    title: 'Clarifications',
                                    dataIndex: 'clarifications',
                                    key: 'clarifications',
                                    align: 'center',
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    key: 'date',
                                    align: 'center',
                                },
                                {
                                    title: 'Total',
                                    dataIndex: 'total',
                                    key: 'total',
                                    align: 'center',
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                    render: function renderStatus(v) {
                                        return <Tag color="geekblue">{v}</Tag>;
                                    },
                                },
                            ]}
                            expandable={{
                                expandedRowRender: ({ plates }) => {
                                    const columns = [
                                        { title: 'Plate', dataIndex: 'title', key: 'title' },
                                        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                                        {
                                            title: 'Weight',
                                            dataIndex: 'weight',
                                            key: 'weight',
                                        },
                                        {
                                            title: 'Subtotal',
                                            dataIndex: 'subtotal',
                                            key: 'subtotal',
                                        },
                                    ];

                                    return <Table columns={columns} dataSource={plates} pagination={false} />;
                                },
                            }}
                            dataSource={[
                                {
                                    order: '1',
                                    name: 'Luciano Alvarez',
                                    table: 'Five B',
                                    clarifications: 'Without salt. Thanks',
                                    date: '1 min ago',
                                    total: '$200',
                                    plates: [
                                        { title: 'Big Mac', weight: '500gr', subtotal: '250', key: 1 },
                                        { title: 'Double Cheese', weight: '425gr', subtotal: '250', key: 2 },
                                    ],
                                    status: 'In Queue',
                                    key: 1,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const afterPresentation = (
        <div className="fade-in w-full flex flex-row 850:flex-col-reverse 850:gap-10 850:space-x-0 items-center p-10 space-x-10">
            <section className="w-1/2 850:w-full">
                <div className="flex flex-col items-start">
                    <div className="flex flex-row items-center space-x-2">
                        <MdMoneyOff className="text-4xl text-red-500" />
                        <p className="m-0 font-semibold text-gray-500 550:text-base text-lg">
                            THE UNIQUE FREE CRM APP FOR RESTAURANTS
                        </p>
                    </div>
                    <h2 className="font-bold text-3xl">Digital Menu Ordering Solution</h2>
                </div>
                <p className="font-semibold text-gray-500 text-lg">
                    <span className="text-black font-bold">Improve your customers experience</span> using our
                    menus-plates system and satisfy your guests with an excellent always up-to-date menu
                </p>
            </section>
            <section className="w-1/2 850:w-full">
                <img className="w-full" alt="" src="https://i.imgur.com/q21xIVc.png" />
            </section>
        </div>
    );

    const reasons = (
        <div id="reasons" className="fade-in flex flex-col items-center space-y-5 p-10 text-center justify-center">
            <h2 className="text-3xl font-bold"> Why DigitalMenu? </h2>
            <div className="flex 600:flex-col 600:space-x-0 600:space-y-10 600:justify-center 600:items-center flex-row space-x-8 justify-between">
                {benefits.map((benefit, index) => (
                    <div key={index} className="w-1/3 600:w-full flex flex-col space-y-3 text-left">
                        <img
                            style={{ width: '55rem' }}
                            className="h-44 600:h-60 object-cover object-center rounded-2xl"
                            src={benefit.image}
                            alt=""
                        />
                        <div className="">
                            <h3 className="text-2xl font-bold">{benefit.title}</h3>
                            <ul className="flex flex-col items-start space-y-4">
                                {benefit.items.map((item, index) => (
                                    <li key={index} className="flex flex-row space-x-2 items-center">
                                        <CheckOutlined style={{ fontSize: '1rem' }} />
                                        <p style={{ fontSize: '1rem' }} className="m-0 font-semibold  text-gray-500">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const footer = (
        <footer className="fade-in p-10 items-start space-y-10 justify-between bg-gray-900 text-white flex flex-col 1700:px-72">
            <section className="flex flex-row flex-wrap gap-10 w-full justify-between">
                <div className="flex flex-col items-start">
                    <h4 className="text-blue-400 text-lg">PRODUCT</h4>
                    <ul className="text-white font-normal flex flex-col items-start space-y-3">
                        <a className="text-white hover:text-white" href="#presentation">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                {' '}
                                Presentation{' '}
                            </li>
                        </a>
                        <a className="text-white hover:text-white" href="#reasons">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                {' '}
                                Reasons{' '}
                            </li>
                        </a>
                        <a className="text-white hover:text-white" href="#features">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                {' '}
                                Features{' '}
                            </li>
                        </a>
                    </ul>
                </div>
                <div className="flex flex-col items-start">
                    <h4 className="text-blue-400 text-lg">CREATOR</h4>
                    <ul className="text-white font-normal flex flex-col items-start space-y-3">
                        <a
                            rel="noreferrer"
                            target="_blank"
                            className="text-white hover:text-white"
                            href="https://www.linkedin.com/in/luciano-alvarez/"
                        >
                            <li className="border-b cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                <span> Linkedin </span>
                            </li>
                        </a>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            className="text-white hover:text-white"
                            href="https://www.github.com/lcnlvrz"
                        >
                            <li className="border-b cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                {' '}
                                Github{' '}
                            </li>
                        </a>
                        <li className="border-b cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                            {' '}
                            lucianoalvarez1212@gmail.com{' '}
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col items-start">
                    <h4 className="text-blue-400 text-lg">USER</h4>
                    <ul className="text-white font-normal flex flex-col items-start space-y-3">
                        <Link to="/auth/register">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                Become User
                            </li>
                        </Link>
                        <Link to="/auth/login">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                Sign In
                            </li>
                        </Link>
                        <Link to="/auth/send-mail-password">
                            <li className="border-b text-white cursor-pointer border-white border-opacity-0 hover:border-opacity-100 cursor-hover transition-all">
                                Forgot Password
                            </li>
                        </Link>
                    </ul>
                </div>
            </section>
            <p className="m-0">© 2021 Luciano Alvarez. All rights reserved</p>
        </footer>
    );

    const features = (
        <div
            id="features"
            className="fade-in flex flex-col items-center space-y-5 p-10 text-center justify-center 400:px-0"
        >
            <h2 className="text-5xl font-bold"> Features </h2>
            {isMax850 ? tableDesktop : isMax600 ? tableTablet : tableMobile}
        </div>
    );

    const callToActionButton = (
        <div className="fade-in p-10 space-y-8 m-10 items-center rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 justify-center text-center flex flex-col my-10">
            <div className="flex flex-col space-y-2">
                <h2 className="font-bold text-3xl text-white m-0">Ready to earn more money?</h2>
                <p className="text-white text-lg m-0">Get started for free, no credit card required.</p>
            </div>
            <div className="flex flex-row 550:flex-col 550:space-x-0 550:space-y-5 space-x-5">
                <Link to="/auth/login?demo=true">
                    <button className="bg-white hover:opacity-50 rounded-full 400:text-lg text-2xl p-4 text-blue-500 font-semibold  transition-all">
                        Try Free Demo
                    </button>
                </Link>
                <Link to="/auth/register">
                    <button className="hover:bg-white font-semibold text-white 400:text-lg text-2xl p-4 border border-white  rounded-full  hover:bg-opacity-10 transition-all">
                        Register
                    </button>
                </Link>
            </div>
        </div>
    );
    return (
        <div className="w-full relative">
            {header}
            <main className="flex flex-col space-y-20 1700:px-72">
                {presentation}
                <InView triggerOnce>
                    {({ inView, ref, entry }) => <div ref={ref}>{inView && afterPresentation}</div>}
                </InView>
                <InView triggerOnce>{({ inView, ref, entry }) => <div ref={ref}>{inView && reasons}</div>}</InView>
                <InView triggerOnce>{({ inView, ref, entry }) => <div ref={ref}>{inView && features}</div>}</InView>
                <InView triggerOnce>
                    {({ inView, ref, entry }) => <div ref={ref}>{inView && callToActionButton}</div>}
                </InView>
            </main>
            {footer}
        </div>
    );
};

export default LandingPage;
