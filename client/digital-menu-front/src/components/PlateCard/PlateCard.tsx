import React from 'react';
import { Button, Collapse, Typography, Image, Tag, Input, Tooltip, message, InputNumber, Spin } from 'antd';
import { usePlateCard } from '../../controllers/plate-card.controller';
import { BsPlus } from 'react-icons/bs';
import Modal from 'antd/lib/modal/Modal';
import { AiOutlineEdit } from 'react-icons/ai';
import { PlateInterface, StatusMenuAndPlate } from '../../interfaces/Restaurant/restaurant.interface';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';

export interface PlateCardProps {
    plate: PlateInterface;
    menuId: number;
    index: number;
    isLoadingChangePlate: boolean;
    Checkbox: JSX.Element;
}

export const PlateCard = (props: PlateCardProps): JSX.Element => {
    const controller = usePlateCard({
        ingredients: props.plate.ingredients,
        menuId: props.menuId,
        plateId: props.plate.id,
        preparationTime: props.plate.preparationTime,
    });

    const changePreparationTime = (
        <Modal
            onCancel={() => {
                if (!controller.isLoading) {
                    controller.handleOpenModal();
                }
            }}
            title="Change preparation time"
            footer={null}
            visible={controller.isOpenModal}
        >
            <div className="flex flex-col items-start space-y-5">
                <div className="flex flex-row space-x-3 items-center">
                    <InputNumber
                        min={1}
                        defaultValue={props.plate.preparationTime}
                        onChange={(value) => controller.setPreparationTime(value as number)}
                    />
                    <span>minutes</span>
                </div>
                <Button
                    type="primary"
                    loading={controller.isLoading}
                    onClick={() =>
                        controller.updateInformation(
                            { preparationTime: controller.preparationTime },
                            props.menuId,
                            props.plate.id,
                            true,
                        )
                    }
                >
                    Save Changes
                </Button>
            </div>
        </Modal>
    );

    const changeWeight = (
        <Typography.Text
            editable={{
                onChange: (value) => {
                    if (Number.isNaN(Number(value)) || !value || Number(value) < 1) {
                        message.error('Only positive numbers!');
                    } else {
                        controller.updateInformation({ weight: Number(value) }, props.menuId, props.plate.id);
                    }
                },
                icon: (
                    <>
                        <span className="text-sm text-black">cal</span>
                        <EditOutlined />
                    </>
                ),
                tooltip: 'Edit weight',
            }}
            className="text-lg font-semibold"
        >
            {props.plate.weight.toString()}
        </Typography.Text>
    );

    const changePrice = (
        <div className="flex flex-row space-x-1 items-center">
            <span className="font-semibold text-sm">$</span>
            <Typography.Text
                editable={{
                    onChange: (value) => {
                        if (Number.isNaN(Number(value)) || !value || Number(value) < 1) {
                            message.error('Only numbers!');
                        } else {
                            controller.updateInformation({ price: Number(value) }, props.menuId, props.plate.id);
                        }
                    },
                    tooltip: 'Edit price',
                }}
                className="text-lg m-0 font-semibold"
            >
                {props.plate.price.toString()}
            </Typography.Text>
        </div>
    );

    const changeIngredients = (
        <Collapse>
            <Collapse.Panel
                header={<Typography.Title style={{ fontSize: '1rem' }}>Ingredients</Typography.Title>}
                key={props.index}
            >
                <ul className="flex flex-wrap flex-row items-center justify-start space-flex">
                    {controller.tags.tags.map((tag, index) => {
                        if (controller.tags.editInputIndex === index) {
                            return (
                                <Input
                                    ref={controller.inputRef}
                                    key={tag}
                                    size="small"
                                    className="tag-input transition-all"
                                    value={controller.tags.editInputValue}
                                    onChange={controller.handleEditInputChange}
                                    onBlur={() => controller.handleEditInputConfirm()}
                                    onPressEnter={() => controller.handleEditInputConfirm()}
                                />
                            );
                        }

                        const isLongTag = tag.length > 20;

                        const tagElem = (
                            <Tag
                                className="edit-tag transition-all"
                                key={tag}
                                closable
                                onClose={() => controller.handleClose(tag)}
                            >
                                <span onDoubleClick={(e) => controller.handleDoubleClick(index, tag, e)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </span>
                            </Tag>
                        );
                        return isLongTag ? (
                            <Tooltip title={tag} key={tag}>
                                {tagElem}
                            </Tooltip>
                        ) : (
                            tagElem
                        );
                    })}
                    {controller.tags.inputVisible && (
                        <Input
                            placeholder="Type some ingredient..."
                            ref={controller.inputRef}
                            type="text"
                            size="small"
                            className="tag-input transition-all"
                            value={controller.tags.inputValue}
                            onChange={controller.handleInputChange}
                            onBlur={() => controller.handleInputConfirm()}
                            onPressEnter={() => controller.handleInputConfirm()}
                        />
                    )}
                    {!controller.tags.inputVisible && (
                        <Button size="small" style={{ padding: '0px 5px' }} onClick={controller.showInput}>
                            <div className="flex flex-row items-center space-x-1">
                                <BsPlus />
                                <span className="text-xs">New Ingredient</span>
                            </div>
                        </Button>
                    )}
                </ul>
            </Collapse.Panel>
        </Collapse>
    );

    const changeDescription = (
        <Typography.Paragraph
            editable={{
                onChange: (value) => {
                    if (!value) {
                        message.error('The description is required!');
                    } else {
                        controller.updateInformation({ description: value }, props.menuId, props.plate.id);
                    }
                },
                tooltip: 'Edit description',
            }}
            style={{ margin: 0 }}
        >
            {props.plate.description}
        </Typography.Paragraph>
    );

    const changeTitle = (
        <Typography.Title
            style={{ fontSize: '1.25rem' }}
            editable={{
                onChange: (value) => {
                    if (!value) {
                        message.error('The title is required!');
                    } else {
                        controller.updateInformation({ title: value }, props.menuId, props.plate.id);
                    }
                },
                tooltip: 'Edit title',
            }}
        >
            {props.plate.title}
        </Typography.Title>
    );

    return (
        <section className="w-full flex flex-col relative">
            <div
                className={`h-full ${
                    controller.isLoading || props.isLoadingChangePlate ? 'flex' : 'hidden'
                } w-full items-center bg-white bg-opacity-80 rounded justify-center absolute z-10`}
            >
                <Spin style={{ color: 'white' }} />
            </div>
            <div className="flex flex-col items-start space-y-5">
                <div className="w-full flex flex-row justify-between">
                    <Button
                        onClick={(e) => {
                            e?.stopPropagation();
                            controller.duplicatePlate();
                        }}
                        icon={<ReloadOutlined />}
                        size="small"
                    >
                        {' '}
                        Duplicate Plate{' '}
                    </Button>
                    <Tag color={props.plate.status === StatusMenuAndPlate.HIDDEN ? 'error' : 'success'}>
                        {props.plate.status}
                    </Tag>
                </div>
                <div className="flex flex-row space-x-2">
                    {props.Checkbox}
                    <span>Select Plate</span>
                </div>
            </div>

            <div className="flex flex-row justify-evenly w-full flex-wrap items-center">
                <Image
                    width="15rem"
                    height="15rem"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                    src={props.plate.image}
                />
                <div className="flex w-96 flex-col items-start space-y-5 800:justify-center 800:text-center 800:items-center">
                    <div className="w-full">
                        {changeTitle}
                        {changeDescription}
                    </div>
                    {changeIngredients}
                    <div className="flex flex-row flex-wrap items-center gap-4 w-full 800:items-center 800:justify-center">
                        {changePrice}
                        <div className="flex flex-row space-x-1 items-end 800:items-center 800:justify-center">
                            <Typography.Text style={{ color: 'black' }} className="text-lg m-0 font-semibold">
                                {props.plate.preparationTime} minutes
                            </Typography.Text>
                            <Tooltip title="Edit Preparation Time">
                                <AiOutlineEdit
                                    onClick={controller.handleOpenModal}
                                    className="text-2xl text-blue-400 cursor-pointer"
                                />
                            </Tooltip>
                        </div>
                        {changeWeight}
                        {changePreparationTime}
                    </div>
                </div>
            </div>
        </section>
    );
};
