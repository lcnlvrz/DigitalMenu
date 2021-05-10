import React, { Fragment } from 'react';
import {
    Collapse,
    Button,
    Typography,
    Menu,
    Dropdown,
    Divider,
    Checkbox,
    Spin,
    Input,
    Pagination,
    Tag,
    Select,
} from 'antd';
import { BiFoodTag, BiCalendar } from 'react-icons/bi';
import { CreateMenu } from '../../components/CreateMenu/CreateMenu';
import { AddPlate } from '../../components/AddPlate/AddPlate';
import { PlateCard } from '../../components/PlateCard/PlateCard';
import moment from 'moment';
import { ActionStatusMenuAndPlate, StatusMenuAndPlate, useMyMenu } from '../../controllers/my-menu.controller';
import { AiFillEye, AiFillEyeInvisible, AiFillDelete } from 'react-icons/ai';
import { GrRestaurant } from 'react-icons/gr';
import { IoIosRestaurant } from 'react-icons/io';
import { ReloadOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { ImPower } from 'react-icons/im';

export const MyMenus = (): JSX.Element => {
    const controller = useMyMenu();

    const isMax500 = useMediaQuery({ maxWidth: '500px' });

    const title = (
        <div className="flex flex-row justify-between flex-wrap items-center gap-2">
            <div className="flex flex-row items-center space-x-2">
                <h1 className="text-3xl font-bold m-0 text-gray-800"> MENUS </h1>
            </div>
            <CreateMenu
                getMenusBySearch={controller.getMenusBySearch}
                isLoading={controller.isLoading}
                selected={controller.selectedMenus}
            />
        </div>
    );

    return (
        <section className="p-5 flex flex-col items-start space-y-5">
            <Checkbox.Group
                value={controller.selectedMenus}
                onChange={(checkedValue) => controller.setSelectedMenus(checkedValue.map((value) => Number(value)))}
                className="w-full flex flex-col space-y-5"
            >
                {title}
                <div className="flex flex-row space-x-5">
                    <Input.Search
                        loading={controller.isLoading}
                        onChange={(e) => controller.setQuery({ value: e.target.value, touched: true })}
                        style={{ width: '250px' }}
                        placeholder="Type any menu..."
                    />
                    <Select
                        style={{ width: '150px' }}
                        defaultValue=""
                        filterOption={false}
                        onSelect={(value) => {
                            controller.setMenuStatusFilter({ value, touched: true });
                        }}
                        options={[
                            { label: 'All', value: '' },
                            { label: 'Public', value: StatusMenuAndPlate.PUBLIC },
                            { label: 'Hidden', value: StatusMenuAndPlate.HIDDEN },
                        ]}
                    />
                </div>

                {controller.isLoading || controller.restaurantCopy.isLoading ? (
                    <div style={{ height: '50vh' }} className="flex items-center justify-center">
                        <Spin />
                    </div>
                ) : controller.restaurantCopy.menus?.length ? (
                    controller.restaurantCopy.menus.map((menu, index) => {
                        const headerPanel = (
                            <section className="flex flex-row flex-wrap gap-2 justify-between items-start">
                                <div className="flex flex-col items-start space-y-5">
                                    <Typography.Title
                                        onClick={(e) => e?.stopPropagation()}
                                        editable={{
                                            onChange: (value) => {
                                                controller.updateMenuInformation(menu.id, { name: value });
                                            },
                                        }}
                                        style={{ fontSize: '1rem', margin: 0 }}
                                    >
                                        {menu.name}
                                    </Typography.Title>
                                    <Button
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            controller.duplicateMenu(menu.id);
                                        }}
                                        icon={<ReloadOutlined />}
                                        size="small"
                                    >
                                        {' '}
                                        Duplicate Menu{' '}
                                    </Button>
                                </div>
                                <div className="flex flex-col items-start font-semibold text-gray-500">
                                    <Tag
                                        style={{ marginBottom: '10px' }}
                                        color={menu.status === StatusMenuAndPlate.HIDDEN ? 'error' : 'success'}
                                    >
                                        {menu.status}
                                    </Tag>
                                    <div className="flex flex-row items-center space-x-1 mt-1">
                                        <BiFoodTag />
                                        <span>
                                            {' '}
                                            {menu.plates?.length || 0}{' '}
                                            {menu.plates && menu.plates?.length > 1 ? 'plates' : 'plate'}{' '}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center space-x-1 mt-1">
                                        <BiCalendar />
                                        <span> {moment(menu.createdAt).format('YYYY/MM/DD')} </span>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <Checkbox
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            value={menu.id}
                                        />
                                        <span className="mt-1">Select Menu</span>
                                    </div>
                                </div>
                            </section>
                        );

                        const menuActions = (
                            <Menu>
                                <Menu.Item
                                    onClick={() =>
                                        controller.changePlateStatus(ActionStatusMenuAndPlate.PUBLISH, menu.id)
                                    }
                                    className="flex flex-row items-center space-x-2"
                                >
                                    <AiFillEye />
                                    <span>Publish</span>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => controller.changePlateStatus(ActionStatusMenuAndPlate.HIDE, menu.id)}
                                    className="flex flex-row items-center space-x-2"
                                >
                                    <AiFillEyeInvisible />
                                    <span>Hide</span>
                                </Menu.Item>
                                <Menu.Item
                                    danger
                                    onClick={() => controller.removePlate(menu.id)}
                                    className="flex flex-row items-center space-x-2"
                                >
                                    <AiFillDelete />
                                    <span>Delete</span>
                                </Menu.Item>
                            </Menu>
                        );

                        return (
                            <div key={index} className="flex flex-row w-full items-start space-x-2">
                                <Collapse style={{ width: '100%' }}>
                                    <Collapse.Panel header={headerPanel} key={index}>
                                        <div className="w-full flex items-center  space-x-3 flex-row justify-between">
                                            <Dropdown
                                                trigger={['click']}
                                                disabled={!controller.selected.length}
                                                overlay={menuActions}
                                            >
                                                <Button loading={controller.isLoading}>
                                                    <div className="w-full flex flex-row items-center space-x-2">
                                                        <ImPower />
                                                        <span>Plate Actions</span>
                                                    </div>
                                                </Button>
                                            </Dropdown>
                                            <AddPlate menuId={menu.id} />
                                        </div>
                                        <div className="flex flex-row 500:flex-col 500:space-x-0 500:space-y-5 500:items-start space-x-5 my-4">
                                            <Input.Search
                                                style={{ width: isMax500 ? '100%' : '250px' }}
                                                loading={controller.isLoadingChangePlate}
                                                onChange={(e) => {
                                                    controller.setQueryPlate({
                                                        value: e.target.value,
                                                        touched: true,
                                                        menuId: menu.id,
                                                    });
                                                }}
                                                placeholder="Search any plate..."
                                            />
                                            <Select
                                                style={{ width: '150px' }}
                                                defaultValue=""
                                                filterOption={false}
                                                onSelect={(value) => {
                                                    controller.setPlateStatusFilter({
                                                        value,
                                                        touched: true,
                                                        menuId: menu.id,
                                                    });
                                                }}
                                                options={[
                                                    { label: 'All', value: '' },
                                                    { label: 'Public', value: StatusMenuAndPlate.PUBLIC },
                                                    { label: 'Hidden', value: StatusMenuAndPlate.HIDDEN },
                                                ]}
                                            />
                                        </div>
                                        <br />
                                        <br />
                                        <Checkbox.Group
                                            value={controller.selected}
                                            style={{ width: '100%' }}
                                            onChange={(checkedValue) => {
                                                console.log(checkedValue);
                                                controller.handleSelect(checkedValue as number[]);
                                            }}
                                        >
                                            {menu.plates?.length ? (
                                                menu.plates.map((plate, index) => (
                                                    <Fragment key={index}>
                                                        <div className="flex flex-row items-center space-x-4">
                                                            <PlateCard
                                                                isLoadingChangePlate={controller.isLoadingChangePlate}
                                                                Checkbox={<Checkbox value={plate.id} />}
                                                                index={index}
                                                                menuId={menu.id}
                                                                plate={plate}
                                                            />
                                                        </div>
                                                        {index + 1 !== menu?.plates?.length && <Divider />}
                                                    </Fragment>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center">
                                                    <IoIosRestaurant className="text-8xl" />
                                                    <h1 className="text-3xl m-0">No plate&apos;s</h1>
                                                    <p className="text-gray-500 m-0">
                                                        {' '}
                                                        Here you&apos;ll see {menu.name}&apos;s plates
                                                    </p>
                                                </div>
                                            )}
                                        </Checkbox.Group>
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ height: '50vh' }} className="flex flex-col items-center justify-center">
                        <GrRestaurant className="text-8xl" />
                        <h1 className="text-3xl">No menu&apos;s</h1>
                        <p className="text-gray-500"> Here you&apos;ll see your restaurant&apos;s menus </p>
                    </div>
                )}
                <div className="w-full flex items-center justify-center">
                    <Pagination
                        current={controller.currentPage.value}
                        onChange={(page) => controller.setCurrentPage({ value: page, touched: true })}
                        pageSize={5}
                        total={controller.pagination?.meta.totalItems}
                    />
                </div>
            </Checkbox.Group>
        </section>
    );
};
