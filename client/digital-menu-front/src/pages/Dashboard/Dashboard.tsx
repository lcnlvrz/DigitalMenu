import moment from 'moment';
import React from 'react';
import { CommentOutlined, MoneyCollectOutlined, ReloadOutlined } from '@ant-design/icons';
import { Divider, Spin, Tooltip, Typography } from 'antd';
import { FaCommentSlash, FaRegSadTear } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../controllers/dashboard.controller';
import './Dashboard.css';

const Dashboard = () => {
    const controller = useDashboard();

    const navigationCards = (
        <div
            className="p-5 
        w-full items-center flex 
        flex-row flex-wrap 
     justify-evenly flex-parent"
        >
            {controller.dashboardCards.map((card, index) => (
                <div
                    key={index}
                    className="shadow-2xl flex flex-col justify-between p-5 bg-white items-start h-56 w-64"
                >
                    <div>
                        <h2 className={`text-${card.color} font-semibold`}>{card.title}</h2>
                        <p className="text-gray-400 font-light w-52">{card.paragraph}</p>
                    </div>
                    <Link to={card.route}>
                        <button
                            className={`bg-${card.color} font-semibold py-2 px-4 text-white hover:bg-white border-2 border-${card.color} border-opacity-0 hover:border-opacity-100 hover:text-${card.color} transition-all`}
                        >
                            {card.button}
                        </button>
                    </Link>
                </div>
            ))}
        </div>
    );

    const allOrders = (
        <div className="w-72 400:w-full bg-white p-5 shadow-2xl space-y-2 padding-all-except-one">
            <div className="flex flex-row justify-between items-center">
                <h3 className="font-semibold text-lg"> Recent Orders </h3>
                <Tooltip title="Refresh">
                    <ReloadOutlined
                        spin={controller.isLoading}
                        onClick={controller.fetchNewOrders}
                        className="reload-icon cursor-pointer transition-all"
                    />
                </Tooltip>
            </div>
            <Divider style={{ margin: 5 }} />
            <ul className="flex flex-col  relative space-y-2">
                {controller.isLoading && (
                    <div className="bg-white bg-opacity-80 w-full flex items-center justify-center h-full absolute z-30 text-center">
                        <Spin />
                    </div>
                )}
                {controller.recentOrders?.length ? (
                    controller.recentOrders.map((order, index) => (
                        <li
                            key={index}
                            className="w-full hover:bg-gray-200 p-2 items-center  flex flex-row justify-between order-item cursor-pointer transition-all"
                        >
                            <div>
                                <Typography.Paragraph
                                    style={{ margin: 0, fontSize: '0.85rem' }}
                                    ellipsis={{ rows: 1 }}
                                    className="m-0 font-semibold"
                                >
                                    {order.firstName + ' ' + order.lastName}
                                </Typography.Paragraph>
                                <Typography.Paragraph
                                    style={{ margin: '1px 0' }}
                                    ellipsis={{ rows: 3 }}
                                    className="m-0 text-xs"
                                >
                                    {order.plates.map((plate, index) => {
                                        if (order.plates.length === index + 1) {
                                            return plate.title;
                                        } else {
                                            return plate.title + ', ';
                                        }
                                    })}
                                </Typography.Paragraph>
                                <p className="m-0 text-xs text-gray-400 mt-1">{moment(order.createdAt).fromNow()}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <MoneyCollectOutlined className="text-2xl" />
                                <p className="m-0 text-black font-semibold text-base mt-2">${order.total}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <div className="w-full flex flex-col items-center justify-center">
                        <FaRegSadTear className="text-5xl text-red-600" />
                        <p className="italic font-semibold"> There aren&apos;t any recent orders </p>
                    </div>
                )}
            </ul>
            <div className="w-full flex items-end justify-end">
                <Link to="/dashboard/my-customers">
                    <button className="bg-red-500 text-xs font-semibold py-1 px-2 text-white hover:bg-white border-2 border-red-500 border-opacity-0 hover:border-opacity-100 hover:text-red-500 transition-all">
                        All Orders
                    </button>
                </Link>
            </div>
        </div>
    );

    const allReviews = (
        <div className="w-72 400:w-full bg-white p-5 shadow-2xl">
            <div className="flex flex-row justify-between items-center">
                <h3 className="font-semibold text-lg"> Recent Feedback </h3>
                <Tooltip title="Refresh">
                    <ReloadOutlined
                        onClick={controller.fetchNewReviews}
                        spin={controller.isLoadingReviews}
                        className="reload-icon cursor-pointer transition-all"
                    />
                </Tooltip>
            </div>
            <Divider style={{ margin: 5 }} />
            <ul className="flex flex-col relative">
                {controller.isLoadingReviews && (
                    <div className="bg-white bg-opacity-80 w-full flex items-center justify-center h-full absolute z-30 text-center">
                        <Spin />
                    </div>
                )}
                {controller.recentReviews?.length ? (
                    controller.recentReviews.map((review, index) => (
                        <li
                            key={index}
                            className="w-full hover:bg-gray-200 p-2 items-center flex flex-row flex-wrap justify-between order-item cursor-pointer transition-all"
                        >
                            <div className="flex w-full flex-row items-center space-x-2">
                                <div className="flex flex-col w-full flex-wrap">
                                    <div className="w-full flex flex-row flex-wrap justify-between">
                                        <Typography.Paragraph
                                            className="font-semibold"
                                            style={{ margin: 0 }}
                                            ellipsis={{ rows: 2 }}
                                        >
                                            {review.order.firstName + ' ' + review.order.lastName}
                                        </Typography.Paragraph>
                                        <div className="flex flex-row space-x-2 items-center">
                                            <CommentOutlined style={{ color: '#FCD34D' }} />
                                            <span className="text-xs font-semibold ">
                                                {review.answers.length} answers
                                            </span>
                                        </div>
                                    </div>
                                    <Typography.Paragraph style={{ margin: 0, width: '15rem' }} ellipsis={{ rows: 15 }}>
                                        {review.surveyForm.name}
                                    </Typography.Paragraph>
                                    <p className="m-0 text-xs text-gray-400 mt-1">
                                        {moment(review.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : controller.isLoadingReviews ? (
                    <div className="w-full text-center my-5">
                        <Spin />
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center">
                        <FaCommentSlash className="text-5xl text-red-600" />
                        <p className="italic font-semibold"> There aren&apos;t any recent reviews </p>
                    </div>
                )}
            </ul>
            <div className="w-full mt-2 flex items-end justify-end">
                <Link to="/dashboard/survey-forms/responses">
                    <button className="bg-red-500 text-xs font-semibold py-1 px-2 text-white hover:bg-white border-2 border-red-500 border-opacity-0 hover:border-opacity-100 hover:text-red-500 transition-all">
                        All Feedback
                    </button>
                </Link>
            </div>
        </div>
    );

    return (
        <main className="flex flex-col justify-evenly p-5">
            <div className="w-full flex flex-row justify-center space-x-3 items-start">
                <img
                    className="w-16 h-16 mt-1"
                    src="https://i.pinimg.com/originals/21/f2/07/21f2078d23f9195570a3711c018328b2.png"
                />
                <div className="flex flex-col items-start">
                    <h1 className="text-4xl m-0 font-semibold">Hi {controller.user.firstName}</h1>
                    <p className="font-light text-lg">Nice too se you again!</p>
                </div>
            </div>
            {navigationCards}
            <section className="flex flex-row flex-wrap gap-4 400:flex-parent-2 justify-evenly items-start w-full">
                {allOrders}
                {allReviews}
            </section>
        </main>
    );
};

export default Dashboard;
