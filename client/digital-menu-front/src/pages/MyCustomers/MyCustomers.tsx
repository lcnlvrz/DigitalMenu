import React from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space, Table, Tag, Select, DatePicker, Input } from 'antd';
import moment from 'moment';
import { useMyCustomers } from '../../controllers/my-customers.controller';
import { OrderStatus, PaymentMethod } from '../../services/order.service';
import './MyCustomers.css';
import { useMediaQuery } from 'react-responsive';

const MyCustomers = () => {
    const controller = useMyCustomers();

    const isMax700Width = useMediaQuery({ maxWidth: '700px' });

    const renderWeight = (weight: string) => <span>{weight} gr</span>;

    const renderTime = (value: string) => {
        const createdAt = moment(value);
        const currentDate = moment();
        const difference = currentDate.diff(createdAt, 'hours');
        if (difference > 24) {
            return <p className="m-0">{moment(value).format('YYYY/MM/DD hh:mm a')}</p>;
        } else {
            return <p className="m-0">{moment(value).fromNow()}</p>;
        }
    };

    const renderStatus = (status: string) => (
        <Tag
            color={
                status === OrderStatus.IN_QUEUE
                    ? 'default'
                    : status === OrderStatus.DONE
                    ? 'success'
                    : status === OrderStatus.WITH_DELAY
                    ? 'warning'
                    : status === OrderStatus.DELIVERED
                    ? 'geekblue'
                    : 'error'
            }
        >
            {status}
        </Tag>
    );

    const renderClarifications = (clarifications: string) => {
        if (!clarifications) {
            return <p className="text-gray-300 m-0">Empty</p>;
        } else {
            return <p className="italic font-semibold m-0">{clarifications}</p>;
        }
    };

    const renderAction = (orderId: number, record: any) => {
        return (
            <Space size="middle">
                <Dropdown
                    trigger={['click']}
                    overlay={
                        <Menu
                            selectedKeys={[record.status]}
                            selectable
                            onSelect={(info) => {
                                const newStatus = info.key as OrderStatus;
                                controller.updateOrder({ newStatus }, orderId);
                            }}
                        >
                            <Menu.Item key={OrderStatus.WITH_DELAY}>Delay</Menu.Item>
                            <Menu.Item key={OrderStatus.DONE}>Done</Menu.Item>
                            <Menu.Item key={OrderStatus.COOKING}>Cooking</Menu.Item>
                            <Menu.Item key={OrderStatus.IN_QUEUE}>Queue</Menu.Item>
                            <Menu.Item key={OrderStatus.CANCELED}>Cancel</Menu.Item>
                            <Menu.Item key={OrderStatus.DELIVERED}>Delivered</Menu.Item>
                        </Menu>
                    }
                >
                    <a className="text-blue-500">Status</a>
                </Dropdown>
            </Space>
        );
    };

    const renderPrice = (price: string) => <span className="font-semibold text-lg">${price}</span>;

    return (
        <div className="w-full p-5">
            <div className="w-full flex flex-row justify-between items-center">
                <h1 className="text-3xl m-0 text-gray-800 font-bold">ORDERS</h1>
                <Button onClick={() => controller.fetchOrders()} type="primary" icon={<ReloadOutlined />}>
                    Reload
                </Button>
            </div>
            <section className="w-full flex flex-col my-8 space-y-3">
                <div className="w-full flex flex-row items-center 700:flex-col 700:space-x-0 justify-between space-x-3 700:space-y-3">
                    <div className="flex flex-col items-start w-1/3 700:w-full">
                        <label>Status:</label>
                        <Select
                            value={controller.filters.status}
                            onSelect={(value) =>
                                controller.setFilters((prevState) => ({ ...prevState, status: value, touched: true }))
                            }
                            style={{ width: '100%' }}
                            defaultValue={OrderStatus.ALL}
                            options={[
                                { label: 'Delay', value: OrderStatus.WITH_DELAY },
                                { label: 'Done', value: OrderStatus.DONE },
                                { label: 'Cooking', value: OrderStatus.COOKING },
                                { label: 'Queue', value: OrderStatus.IN_QUEUE },
                                { label: 'Cancel', value: OrderStatus.CANCELED },
                                { label: 'Delivered', value: OrderStatus.DELIVERED },
                                { label: 'All', value: OrderStatus.ALL },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col items-start w-1/3 700:w-full">
                        <label>Update Time:</label>
                        <DatePicker.RangePicker
                            onChange={(_, formatString) => {
                                controller.setFilters((prevState) => ({
                                    ...prevState,
                                    updateTime: formatString[0] && formatString[1] ? formatString : undefined,
                                    touched: true,
                                }));
                            }}
                            value={
                                controller.filters.updateTime
                                    ? [
                                          moment(controller.filters.updateTime[0]),
                                          moment(controller.filters.updateTime[1]),
                                      ]
                                    : undefined
                            }
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="flex flex-col items-start w-1/3 700:w-full">
                        <label className="">Search:</label>
                        <Input.Search
                            placeholder="Search by Table or Name..."
                            onChange={(e) =>
                                controller.setFilters((prevState) => ({
                                    ...prevState,
                                    search: e.target.value,
                                    touched: true,
                                }))
                            }
                            style={{ margin: 0 }}
                        />
                    </div>
                </div>
                <div style={{ width: isMax700Width ? '100%' : '32.5%' }} className="flex flex-col items-start ">
                    <label>Tables:</label>
                    <Select
                        onClear={() =>
                            controller.setFilters((prevState) => ({ ...prevState, table: undefined, touched: true }))
                        }
                        allowClear
                        placeholder="Choose one"
                        onSelect={(value, option) => {
                            controller.setFilters((prevState) => ({
                                ...prevState,
                                table: option.label?.toString() || undefined,
                                touched: true,
                            }));
                        }}
                        filterOption={false}
                        options={controller.restaurant?.tables?.map((table, index) => ({
                            label: table.name,
                            value: table.id,
                            key: index,
                        }))}
                        style={{ width: '100%' }}
                        value={controller.filters.table}
                    />
                </div>
            </section>
            <Table
                pagination={{
                    pageSize: 5,
                    position: ['bottomCenter'],
                    total: controller.paginationMeta?.totalItems,
                    current: controller.currentPage.value,
                }}
                loading={controller.isLoading}
                onChange={(pagination, filter, sorter) => {
                    const sorterParsed = { ...sorter } as { field?: string; order?: string };
                    controller.setSort({
                        field: sorterParsed.field || '',
                        touched: true,
                        order: sorterParsed.order?.toLocaleUpperCase() || '',
                    });
                    controller.setCurrentPage({ value: pagination.current || 1, touched: true });
                }}
                scroll={{ x: 400 }}
                className="components-table-demo-nested"
                columns={[
                    {
                        title: 'Order',
                        dataIndex: 'id',
                        key: 'id',
                        sorter: (a, b) => {
                            return a.id - b.id;
                        },
                        align: 'center',
                        filterMultiple: true,
                    },
                    { title: 'Name', dataIndex: 'customerName', key: 'customerName', align: 'center' },
                    {
                        title: 'Table',
                        dataIndex: 'table',
                        key: 'table',
                        align: 'center',
                        render: function RenderTable(_, order) {
                            return <p className="m-0">{order.tableName}</p>;
                        },
                    },
                    {
                        title: 'Payment Method',
                        dataIndex: 'paymentMethod',
                        key: 'paymentMethod',
                        align: 'center',
                        render: function RenderPaymentMethod(v) {
                            return <span>{v === PaymentMethod.EFFECTIVE ? 'Effective' : 'Other'}</span>;
                        },
                    },
                    {
                        title: 'Clarifications',
                        dataIndex: 'clarifications',
                        key: 'clarifications',
                        render: renderClarifications,
                        align: 'center',
                    },
                    {
                        title: 'Date',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: renderTime,
                        sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
                        align: 'center',
                    },
                    {
                        title: 'Total',
                        dataIndex: 'total',
                        key: 'total',
                        render: renderPrice,
                        align: 'center',
                        sorter: (a, b) => a.total - b.total,
                    },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        key: 'action',
                        render: renderAction,
                        align: 'center',
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
                                render: renderWeight,
                            },
                            { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: renderPrice },
                        ];

                        return (
                            <Table
                                columns={columns}
                                dataSource={plates.map((plate, index) => ({ ...plate, key: index }))}
                                pagination={false}
                            />
                        );
                    },
                }}
                dataSource={controller.customersOrders?.map((order, index) => ({
                    ...order,
                    orderNumber: order.id,
                    customerName: order.firstName + ' ' + order.lastName,
                    key: index,
                    action: order.id,
                    total: order.total,
                }))}
            />
        </div>
    );
};

export default MyCustomers;
