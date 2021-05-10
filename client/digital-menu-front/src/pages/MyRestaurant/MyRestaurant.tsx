import Avatar from 'antd/lib/avatar/avatar';
import React, { Fragment } from 'react';
import { Tabs, Dropdown, Typography, Button, Switch, Form, Divider, message } from 'antd';
import { MenuOptionsPhoto } from '../../components/MenuOptionsPhoto/MenuOptionsPhoto';
import { ModalUpdatePhoto } from '../../components/ModalUpdatePhoto/ModalUpdatePhoto';
import { useMyRestaurant } from '../../controllers/my-restaurant.controller';
import { FcEditImage } from 'react-icons/fc';
import { ModalConfirm } from '../../components/ModalConfirm/ModalConfirm';
import { ModalEditSchedule } from '../../components/ModalEditSchedule/ModalEditSchedule';
import './MyRestaurant.css';
import { PhoneOutlined } from '@ant-design/icons';

export const MyRestaurant = (): JSX.Element => {
    const controller = useMyRestaurant();

    const leftSide = (
        <div className="flex flex-row w-full space-x-2">
            <Dropdown
                trigger={['click']}
                overlay={
                    <MenuOptionsPhoto
                        executeInRender={controller.profile}
                        handleDelete={controller.handleOpenDeletePhoto}
                        handleUpdate={controller.handleOpenUpdatePhoto}
                    />
                }
            >
                <Avatar
                    className="cursor-pointer avatar-profile2"
                    shape="square"
                    src={
                        controller.restaurant.profilePhoto ||
                        'https://i2.wp.com/news.microsoft.com/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1'
                    }
                />
            </Dropdown>
            <div className="flex flex-col w-full">
                <Typography.Paragraph
                    ellipsis={{ rows: 1 }}
                    title="name"
                    className="name-restaurant"
                    style={{
                        width: '100%',
                        color: 'white',
                        fontSize: '1.5rem',
                        margin: 0,
                        fontWeight: 'bolder',
                        background: 'transparent',
                    }}
                    editable={{
                        autoSize: { maxRows: 1, minRows: 1 },
                        onChange: (value) =>
                            value &&
                            value !== controller.restaurant.name &&
                            controller.updateRestaurant.execute({ name: value }),
                    }}
                >
                    {controller.restaurant.name}
                </Typography.Paragraph>
                <Typography.Paragraph
                    ellipsis={{ rows: 1 }}
                    title="name"
                    style={{
                        color: 'white',
                        width: '100%',
                        fontSize: '0.9rem',
                        margin: 0,
                        fontWeight: 'lighter',
                        background: 'transparent',
                    }}
                    editable={{
                        autoSize: { maxRows: 1, minRows: 1 },
                        onChange: (value) =>
                            value &&
                            value !== controller.restaurant.location &&
                            controller.updateRestaurant.execute({ location: value }),
                    }}
                >
                    {controller.restaurant.location}
                </Typography.Paragraph>
            </div>
        </div>
    );

    const rightSide = (
        <Dropdown
            trigger={['click']}
            overlay={
                <MenuOptionsPhoto
                    executeInRender={controller.banner}
                    handleDelete={controller.handleOpenDeletePhoto}
                    handleUpdate={controller.handleOpenUpdatePhoto}
                />
            }
        >
            <FcEditImage className="inline-block text-3xl opacity-100 transition-all cursor-pointer" />
        </Dropdown>
    );

    const information = (
        <div className="my-5 p-5">
            <Tabs type="card">
                <Tabs.TabPane tab="About" key="1">
                    <h2 className="text-lg font-semibold"> What is {controller.restaurant.name}? </h2>
                    <Typography.Paragraph
                        title="name"
                        style={{
                            fontSize: '0.9rem',
                            margin: 0,
                            width: '100%',
                            fontWeight: 'lighter',
                            background: 'transparent',
                        }}
                        editable={{
                            onChange: (value) =>
                                value &&
                                value !== controller.restaurant.description &&
                                controller.updateRestaurant.execute({ description: value }),
                        }}
                    >
                        {controller.restaurant.description}
                    </Typography.Paragraph>
                </Tabs.TabPane>
                <Tabs.TabPane className="flex flex-row justify-between flex-wrap" tab="Information" key="2">
                    <section className="w-2/4 500:w-full">
                        <h2 className="text-lg font-semibold">Schedule</h2>
                        <ul>
                            {controller.restaurant?.schedule?.map((day, index) => (
                                <Fragment key={index}>
                                    <li className="w-full flex flex-row justify-between">
                                        <p className="m-0 font-semibold text-gray-500">{day.day}</p>
                                        <p className="m-0">
                                            {day.hour[0]} - {day.hour[1]}
                                        </p>
                                    </li>
                                    {index + 1 !== controller.restaurant?.schedule?.length && (
                                        <Divider style={{ margin: '10px 0' }} />
                                    )}
                                </Fragment>
                            ))}
                        </ul>
                        <Button className="mt-5" onClick={controller.handleOpenEditSchedule} type="primary">
                            {' '}
                            Edit{' '}
                        </Button>
                        <div className="w-full my-5 flex flex-col">
                            <h2 className="text-lg font-semibold">Cellphone Number</h2>
                            <div className="flex flex-row items-center gap-2">
                                <PhoneOutlined />
                                <Typography.Paragraph
                                    style={{ margin: 0 }}
                                    editable={{
                                        onChange: (value) => {
                                            if (Number.isNaN(Number(value)) || !value || Number(value) < 1) {
                                                message.error('Only positive numbers!');
                                            } else {
                                                controller.updateRestaurant.execute({ cellphone: value });
                                            }
                                        },
                                    }}
                                >
                                    {controller.restaurant.cellphone}
                                </Typography.Paragraph>
                            </div>
                        </div>
                    </section>
                </Tabs.TabPane>
                <Tabs.TabPane className="flex flex-col justify-between" tab="Configuration" key="3">
                    <Form className="flex flex-col justify-between 400:flex-col flex-wrap w-full" layout="vertical">
                        <Form.Item label="Delivery">
                            <Switch
                                onChange={(checked) => controller.updateRestaurant.execute({ isDelivery: checked })}
                                checked={controller.restaurant.isDelivery}
                                unCheckedChildren={<span> No </span>}
                                checkedChildren={<span> Yes </span>}
                            />
                        </Form.Item>
                        <Form.Item label="Payment Method">
                            <Switch
                                onChange={(checked) =>
                                    controller.updateRestaurant.execute({ hasOtherPaymentMethod: checked })
                                }
                                checked={controller.restaurant.hasOtherPaymentMethod}
                                unCheckedChildren={<span> Only effective </span>}
                                checkedChildren={<span> Effective and others </span>}
                            />
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );

    return (
        <section className="p-5">
            <div className="flex flex-row space-x-2 700:flex-col 700:items-start 700:space-x-0">
                <label className="font-semibold text-black">Your Digital Menu Profile Link:</label>
                <Typography.Paragraph ellipsis={{ rows: 1 }} style={{ fontWeight: 500, color: 'gray' }} copyable>
                    {location.origin + '/restaurant/profile?id=' + controller.restaurant.id}
                </Typography.Paragraph>
            </div>
            <div className="bg-white rounded">
                <div className="banner w-full h-44 relative bg-black">
                    <div className="absolute z-30 w-full h-full flex items-center top-0 p-5 flex-row justify-between">
                        {leftSide}
                        {rightSide}
                    </div>
                    <img
                        className="h-full w-full object-cover object-center rounded opacity-60"
                        src={
                            controller.restaurant.bannerPhoto ||
                            'https://josephliu.co/wp-content/uploads/2019/06/10-ferdinand-stohr-149422-unsplash.jpg'
                        }
                    />
                </div>
                {information}
            </div>
            <ModalUpdatePhoto
                bannerOrPhoto={controller.bannerOrPhoto}
                handleOpen={controller.handleOpenUpdatePhoto}
                isOpen={controller.openUpdatePhoto}
            />
            <ModalConfirm
                cancelHandle={controller.handleOpenDeletePhoto}
                okHandle={controller.removePhoto}
                visible={controller.openDeletePhoto}
                isLoading={controller.isLoadingDeletePhoto}
            />
            <ModalEditSchedule
                isLoading={controller.isLoadingEditSchedule}
                handleSubmit={controller.updateRestaurant.execute}
                restaurant={controller.restaurant}
                handleOpen={controller.handleOpenEditSchedule}
                isVisible={controller.openEditSchedule}
            />
        </section>
    );
};
