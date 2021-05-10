import { Divider, Select, Spin, DatePicker, Modal, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useReports } from '../../controllers/reports.controller';

const Reports = () => {
    const controller = useReports();

    const isMin1200 = useMediaQuery({ minWidth: '1200px' });

    if (controller.isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    const modalRangeDate = (
        <Modal
            onOk={() =>
                controller.getReportByFilter([
                    controller.rangeValue[0].toISOString(),
                    controller.rangeValue[1].toISOString(),
                ])
            }
            okButtonProps={{ disabled: !controller.rangeValue, loading: controller.isLoadingFilter }}
            onCancel={() => controller.setVisible(false)}
            okText="Filter"
            closable={false}
            title="Custom Filter"
            visible={controller.visible}
        >
            <DatePicker.RangePicker
                value={controller.rangeValue}
                onChange={(values) => controller.setRangeValue(values)}
            />
        </Modal>
    );

    return (
        <div className="p-5 flex flex-col overflow-hidden space-y-20">
            <h1 className="font-bold text-3xl m-0 text-gray-800">REPORTS</h1>
            <div
                style={{ marginTop: '20px' }}
                className={`flex flex-row ${
                    isMin1200 ? 'justify-between' : 'justify-evenly'
                }  gap-5 flex-wrap items-center 400:flex-col 400:items-start`}
            >
                <div className="flex flex-row bg-white p-5 rounded-2xl shadow-2xl 400:w-full space-x-5 400:space-x-0 400:justify-between 400:items-center">
                    <h2 className="font-semibold 400:m-0">Open Survey Forms</h2>
                    <span className="text-red-500 text-2xl font-bold"> {controller.report?.openSurveyForms} </span>
                </div>

                <div className="flex flex-row bg-white p-5 rounded-2xl shadow-2xl 400:w-full space-x-5 400:space-x-0 400:justify-between 400:items-center">
                    <h2 className="font-semibold 400:m-0">Running Campaings</h2>
                    <span className="text-yellow-500 text-2xl font-bold"> {controller.report?.runningCampaings} </span>
                </div>

                <div className="flex flex-row bg-white p-5 rounded-2xl shadow-2xl 400:w-full space-x-5 400:space-x-0 400:justify-between 400:items-center">
                    <h2 className="font-semibold 400:m-0">Menus Published</h2>
                    <span className="text-blue-500 text-2xl font-bold">{controller.report?.menusPublished}</span>
                </div>

                <div className="flex bg-white p-5 rounded-2xl shadow-2xl flex-row 400:w-full space-x-5 400:space-x-0 400:justify-between 400:items-center">
                    <h2 className="font-semibold 400:m-0">Plates Published</h2>
                    <span className="text-green-500 text-2xl font-bold"> {controller.report?.platesPublished} </span>
                </div>

                <div className="flex flex-row bg-white p-5 rounded-2xl shadow-2xl 400:w-full space-x-5 400:space-x-0 400:justify-between 400:items-center">
                    <h2 className="font-semibold 400:m-0">Tables Created</h2>
                    <span className="text-indigo-500 text-2xl font-bold"> {controller.report?.tablesCreated} </span>
                </div>
            </div>
            <section className="w-full flex flex-row items-start gap-14 justify-between 800:flex-col 800:items-start 800:justify-center">
                <div className="flex flex-col bg-white p-5 rounded-2xl shadow-2xl w-2/4 800:w-full space-y-5">
                    <h2 className="text-2xl font-semibold">Top Viewed Items</h2>
                    {controller.report?.topPlatesViews?.length ? (
                        controller.report?.topPlatesViews?.map((plate, index) => (
                            <div key={index} className="w-full flex flex-row items-start justify-between space-x-3 ">
                                <img className="w-24 h-24 object-contain" src={plate.image} alt="" />
                                <div className="flex flex-col items-start">
                                    <h3 className="font-semibold m-0">{plate.title}</h3>

                                    <Typography.Paragraph style={{ color: 'gray', margin: 0 }} ellipsis={{ rows: 3 }}>
                                        {plate.description}
                                    </Typography.Paragraph>
                                </div>
                                <span className="text-red-500 font-semibold text-2xl">{plate.views}</span>
                            </div>
                        ))
                    ) : (
                        <p className="italic"> Any plate matched with this category </p>
                    )}
                </div>
                <div className="flex bg-white p-5 rounded-2xl shadow-2xl flex-col w-2/4 800:w-full space-y-5">
                    <h2 className="text-2xl font-semibold">Least Viewed Items</h2>
                    {controller.report?.lowerPlatesViews?.length ? (
                        controller.report?.lowerPlatesViews?.map((plate, index) => (
                            <div key={index} className="w-full flex flex-row items-start justify-between space-x-3">
                                <img className="w-24 h-24 object-contain" src={plate.image} alt="" />
                                <div className="flex flex-col items-start">
                                    <h3 className="font-semibold m-0">{plate.title}</h3>
                                    <Typography.Paragraph style={{ color: 'gray', margin: 0 }} ellipsis={{ rows: 3 }}>
                                        {plate.description}
                                    </Typography.Paragraph>
                                </div>
                                <span className="text-red-500 font-semibold text-2xl">{plate.views}</span>
                            </div>
                        ))
                    ) : (
                        <p className="italic"> Any plate matched with this category </p>
                    )}
                </div>
            </section>
            <section className="w-full items-start flex flex-row gap-14 700:space-x-0  700:flex-col 700:items-center 700:justify-center">
                <div className="w-2/4 bg-white p-5 rounded-2xl shadow-2xl flex flex-col space-y-5 700:w-full">
                    <div>
                        <h2 className="m-0 text-2xl font-semibold">Daily Sales</h2>
                        <p className="text-gray-400 m-0">Check out each column for daily sales</p>
                    </div>
                    {controller.report?.dailySales?.length ? (
                        <ul className="w-full flex flex-col space-y-5">
                            {controller.report.dailySales.map((sale, index) => (
                                <li key={index} className="flex flex-row justify-between items-start">
                                    <div className="flex flex-col items-start">
                                        <p className="m-0 font-semibold">{sale.completeName}</p>
                                        <p className="font-light text-gray-500 m-0">
                                            {moment(sale.updatedAt).fromNow()}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-lg m-0">${sale.total} USD</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-3xl font-bold text-gray-300"> No Sales </span>
                    )}
                </div>
                <div className="w-2/4 flex flex-col 700:w-full bg-white p-5 rounded-2xl shadow-2xl">
                    <div className="w-full flex items-end justify-end my-2">
                        <Select
                            value={controller.select}
                            onSelect={(value) => {
                                controller.setSelect(value);
                                controller.setIsSelectTouched(true);
                            }}
                            style={{ width: '150px' }}
                            labelInValue
                            options={controller.selectOptions}
                        />
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <h2 className="m-0 font-semibold">Tickets/Clients Closed</h2>
                        <span className="text-red-500 font-semibold text-lg ">{controller.report?.ticketsClosed}</span>
                    </div>
                    <Divider style={{ margin: '10px 0' }} className="w-full" type="horizontal" />
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="m-0 font-semibold">Plates Served</h2>
                        <span className="font-semibold text-lg">{controller.report?.platesServed}</span>
                    </div>
                    <Divider style={{ margin: '10px 0' }} className="w-full" type="horizontal" />
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="m-0 font-semibold">Revenue</h2>
                        <span className="font-semibold text-lg text-green-500">
                            ${controller.report?.revenue || 0} USD
                        </span>
                    </div>
                    <Divider style={{ margin: '10px 0' }} className="w-full" type="horizontal" />
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="m-0 font-semibold">Avg Ticket Size</h2>
                        <span className="font-semibold text-lg text-blue-400">
                            ${controller.report?.averageTicketSize || 0} USD
                        </span>
                    </div>
                    <Divider style={{ margin: '10px 0' }} className="w-full" type="horizontal" />
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="m-0 font-semibold">Avg Ticket Time</h2>
                        <span className="font-semibold text-lg text-blue-600">
                            {controller.report?.averageTicketTime || 0} min(s)
                        </span>
                    </div>
                </div>
            </section>
            {modalRangeDate}
        </div>
    );
};

export default Reports;
