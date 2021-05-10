import React from 'react';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select, Input, Table, Tag, Typography, Modal, Rate, Radio, Tooltip } from 'antd';
import {
    SurveyFormResponseFilter,
    useResponsesSurveyForm,
} from '../../../controllers/responses-survey-form.controller';
import './ResponsesSurveyForm.css';
import { SurveyFormResponseStatus } from '../../../services/order.service';
import moment from 'moment';
import { TypesQuestion } from '../../../controllers/create-survey-form.controller';
import { FaMeh, FaSadCry, FaSmile } from 'react-icons/fa';
import { EmojiStatus } from '../../../controllers/customer-order-portal.controller';
import { Link } from 'react-router-dom';

const ResponsesSurveyForm = () => {
    const controller = useResponsesSurveyForm();

    const modalViewForm = (
        <Modal
            footer={
                <Button onClick={controller.onCloseFormResponse} type="default">
                    Back
                </Button>
            }
            closable={false}
            title={null}
            visible={controller.visible}
        >
            <section className="flex flex-col w-full items-start space-y-5">
                <div className="flex flex-row justify-between items-start w-full">
                    <div>
                        <h2 className="text-2xl mt-0"> Feedback {controller.form?.id} </h2>
                        <div className="flex flex-row space-x-3">
                            <label className="font-semibold text-gray-600"> Date </label>
                            <p> {moment(controller.form?.createdAt).format('YYYY/MM/DD hh:mm a')} </p>
                        </div>
                        <div className="flex flex-row space-x-3">
                            <label className="font-semibold text-gray-600"> Table </label>
                            <p> {controller.form?.order?.tableName} </p>
                        </div>
                        <div className="flex flex-row space-x-3">
                            <label className="font-semibold text-gray-600"> Form </label>
                            <p> {controller.form?.surveyForm?.name} </p>
                        </div>
                    </div>
                    <Tag
                        style={{ margin: 0 }}
                        color={controller.form?.status === SurveyFormResponseStatus.CLOSED ? 'error' : 'success'}
                    >
                        {controller.form?.status}
                    </Tag>
                </div>
                <div className="w-full">
                    <h3 className="text-lg">Answers</h3>
                    <div className="flex flex-col space-y-4 w-full">
                        {controller.form?.answers?.length ? (
                            controller.form?.answers?.map((answer, index) => {
                                switch (answer.type) {
                                    case TypesQuestion.RATING:
                                        return (
                                            <div key={index} className="flex flex-row justify-between items-end">
                                                <label className="font-semibold text-gray-500">
                                                    {' '}
                                                    {answer.question}{' '}
                                                </label>
                                                <Rate disabled value={answer.value} />
                                            </div>
                                        );

                                    case TypesQuestion.SMILEY:
                                        return (
                                            <div key={index} className="flex flex-row  items-center justify-between">
                                                <label className="font-semibold text-gray-500">
                                                    {' '}
                                                    {answer.question}{' '}
                                                </label>
                                                <div className="text-lg flex flex-row space-x-3">
                                                    <FaSadCry
                                                        className={`${
                                                            answer.value === EmojiStatus.SAD
                                                                ? 'text-yellow-300'
                                                                : 'text-gray-300'
                                                        }  transition-all cursor-pointer`}
                                                    />
                                                    <FaSmile
                                                        className={` ${
                                                            answer.value === EmojiStatus.SMILE
                                                                ? 'text-yellow-300'
                                                                : 'text-gray-300'
                                                        }  transition-all cursor-pointer`}
                                                    />
                                                    <FaMeh
                                                        className={` ${
                                                            answer.value === EmojiStatus.MEH
                                                                ? 'text-yellow-300'
                                                                : 'text-gray-300'
                                                        }  transition-all cursor-pointer`}
                                                    />
                                                </div>
                                            </div>
                                        );

                                    case TypesQuestion.YES_OR_NO:
                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-row space-x-10 justify-between items-center"
                                            >
                                                <label className="font-semibold text-gray-500">
                                                    {' '}
                                                    {answer.question}{' '}
                                                </label>
                                                <Radio.Group
                                                    value={answer.value}
                                                    style={{ margin: 0 }}
                                                    className="mt-2"
                                                >
                                                    <Radio style={{ margin: 0 }} value="YES">
                                                        Yes
                                                    </Radio>
                                                    <Radio style={{ margin: 0 }} value="NO">
                                                        No
                                                    </Radio>
                                                </Radio.Group>
                                            </div>
                                        );

                                    case TypesQuestion.TEXT:
                                        return (
                                            <div key={index} className="flex flex-row justify-between w-full">
                                                <label className="font-semibold text-gray-500">
                                                    {' '}
                                                    {answer.question}{' '}
                                                </label>
                                                <p className="m-0">{answer.value}</p>
                                            </div>
                                        );
                                }
                            })
                        ) : (
                            <p>
                                The customer didn&apos;t answer any question. Does this Survey Form have mandatory
                                questions?
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </Modal>
    );

    return (
        <div className="w-full p-5">
            <div className="flex flex-row justify-between w-full 400:flex-col 400:items-start 400:space-y-3 400:mb-3">
                <div className="flex flex-row space-x-3 items-center">
                    <Link to="/dashboard/survey-forms">
                        <Tooltip title="Back">
                            <button className="bg-transparent active:outline-none focus:outline-none">
                                <ArrowLeftOutlined className="back-arrow transition-all cursor-pointer" />
                            </button>
                        </Tooltip>
                    </Link>
                    <h1 className="text-lg m-0"> Survey Form Results </h1>
                </div>
                <Button
                    onClick={() => controller.fetchSurveyFormResponses()}
                    className="font-semibold"
                    type="primary"
                    icon={<ReloadOutlined />}
                >
                    Reload
                </Button>
            </div>
            <div className="mt-5">
                <Form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}
                    layout="vertical"
                >
                    <div className="w-full flex flex-row items-center justify-evenly parent-wrap-on-mobile gap-3">
                        <Form.Item className="item-same-width" label="Status:">
                            <Select
                                value={controller.filterSelected}
                                onSelect={(val) => {
                                    controller.setFilterSelected(val);
                                    controller.setTouched(true);
                                }}
                                defaultValue={SurveyFormResponseFilter.ALL}
                            >
                                <Select.Option value={SurveyFormResponseFilter.ALL}> All </Select.Option>
                                <Select.Option value={SurveyFormResponseFilter.OPEN}> Open </Select.Option>
                                <Select.Option value={SurveyFormResponseFilter.CLOSED}>Closed</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item className="item-same-width" label="Update Time:">
                            <DatePicker.RangePicker
                                onChange={(dates) => {
                                    controller.setQueryRangeDate([
                                        dates?.[0]?.toISOString() || '',
                                        dates?.[1]?.toISOString() || '',
                                    ]);
                                    controller.setTouched(true);
                                }}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="Searcher" className="item-same-width">
                            <Input.Search
                                value={controller.queryInput}
                                onChange={(e) => {
                                    controller.setQueryInput(e.target.value);
                                    controller.setTouched(true);
                                }}
                                placeholder="Search Form or Table..."
                            />
                        </Form.Item>
                    </div>
                </Form>
                <Table
                    onChange={(p, filter, sorter) => {
                        controller.setCurrentPage({ touched: true, value: p.current || 1 });
                        controller.setPagination(p);
                        const sorterParsed = { ...sorter } as { field?: string; order?: string };
                        controller.setSort({
                            field: sorterParsed.field || '',
                            touched: true,
                            order: sorterParsed.order?.toLocaleUpperCase() || '',
                        });
                        controller.setTouched(true);
                    }}
                    pagination={{
                        pageSize: controller.paginationMeta?.itemsPerPage || 5,
                        style: { display: 'inline-block' },
                        position: ['bottomCenter'],
                        total: controller.paginationMeta?.totalItems,
                        current: controller.currentPage.value,
                    }}
                    loading={controller.isLoading}
                    style={{ textAlign: 'center' }}
                    className="text-center"
                    scroll={{ x: 400 }}
                    bordered={false}
                    dataSource={controller.columnsData?.map((data, index) => ({ ...data, key: index }))}
                    columns={[
                        {
                            title: 'Date',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            align: 'center',
                            render: function RenderDate(val) {
                                return <span>{moment(val).format('YYYY/MM/DD hh:mm a')}</span>;
                            },
                            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
                        },
                        {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            render: function RenderStatus(val) {
                                const status = val as SurveyFormResponseStatus;
                                return (
                                    <Tag
                                        style={{ margin: 0 }}
                                        color={status === SurveyFormResponseStatus.CLOSED ? 'error' : 'success'}
                                    >
                                        {val}
                                    </Tag>
                                );
                            },
                            align: 'center',
                        },
                        {
                            title: 'Form',
                            dataIndex: 'form',
                            key: 'form',
                            align: 'center',
                            render: function RenderFormName(val) {
                                return (
                                    <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                                        {val || 'Not specified'}
                                    </Typography.Paragraph>
                                );
                            },
                        },
                        {
                            title: 'Table',
                            dataIndex: 'table',
                            key: 'table',
                            render: function RenderTable(val) {
                                return <span> {val || 'Not specified'} </span>;
                            },
                            align: 'center',
                        },
                        {
                            title: 'Actions',
                            dataIndex: 'actions',
                            key: 'actions',
                            render: function RenderAction(val) {
                                const responseStatus = controller.restaurant?.surveyFormsResponses?.[val]?.status;

                                return (
                                    <div className="flex flex-row space-x-3 w-full items-center justify-center">
                                        <button
                                            onClick={() => controller.onViewFormResponse(val)}
                                            className="bg-red-500 font-semibold text-white py-1 px-3 rounded hover:bg-red-800 transition-all"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => controller.onChangeStatus(val)}
                                            className={`${
                                                responseStatus === SurveyFormResponseStatus.CLOSED
                                                    ? 'bg-green-500'
                                                    : 'bg-yellow-500'
                                            } font-semibold text-white py-1 px-3 rounded ${
                                                responseStatus === SurveyFormResponseStatus.CLOSED
                                                    ? 'hover:bg-green-800'
                                                    : 'hover:bg-yellow-500'
                                            } transition-all`}
                                        >
                                            {responseStatus !== SurveyFormResponseStatus.CLOSED ? 'Close' : 'Open'}
                                        </button>
                                    </div>
                                );
                            },
                            align: 'center',
                        },
                    ]}
                />
            </div>
            {modalViewForm}
        </div>
    );
};

export default ResponsesSurveyForm;
