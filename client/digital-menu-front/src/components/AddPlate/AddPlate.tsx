import { Button, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { Fragment } from 'react';
import { useAddPlate } from '../../controllers/add-plate.controller';
import { Tag, Input as InputAntd } from 'antd';
import { Input, Form, SubmitButton, InputNumber } from 'formik-antd';
import { BsPlus } from 'react-icons/bs';
import { Formik } from 'formik';
import { PlateSchema } from '../../schema/Plate/plate.schema';
import ImageUpload from '../ImageUpload/ImageUpload';

export interface CreatePlate {
    title: string;
    description: string;
    price: string;
    ingredients: string[];
    weight: number;
    preparationTime: number;
    image?: string;
}

export interface AddPlateProps {
    menuId: number;
}

export const AddPlate = (props: AddPlateProps) => {
    const controller = useAddPlate();

    return (
        <Fragment>
            <Button onClick={controller.handleOpen} type="primary">
                Add Plate
            </Button>
            <Modal destroyOnClose closable={false} footer={null} visible={controller.visible}>
                <Formik
                    onSubmit={(values) => controller.createPlate(values, props.menuId)}
                    validationSchema={PlateSchema}
                    initialValues={controller.initialValuesAddPlate}
                >
                    {({ values, setValues, errors, touched, setFieldError, setFieldTouched, setFieldValue }) => {
                        const ingredients = (
                            <>
                                {controller.tags.tags.map((tag, index) => {
                                    if (controller.tags.editInputIndex === index) {
                                        return (
                                            <InputAntd
                                                ref={controller.inputRef}
                                                key={tag}
                                                size="small"
                                                className="tag-input transition-all"
                                                value={controller.tags.editInputValue}
                                                onChange={controller.handleEditInputChange}
                                                onBlur={() => controller.handleEditInputConfirm(setValues)}
                                                onPressEnter={() => controller.handleEditInputConfirm(setValues)}
                                            />
                                        );
                                    }

                                    const isLongTag = tag.length > 20;

                                    const tagElem = (
                                        <Tag
                                            className="edit-tag transition-all"
                                            key={tag}
                                            closable
                                            onClose={() => controller.handleClose(tag, setValues)}
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
                                    <InputAntd
                                        placeholder="Type some ingredient..."
                                        ref={controller.inputRef}
                                        type="text"
                                        size="small"
                                        className="tag-input transition-all"
                                        value={controller.tags.inputValue}
                                        onChange={controller.handleInputChange}
                                        onBlur={() => controller.handleInputConfirm(setValues)}
                                        onPressEnter={() => controller.handleInputConfirm(setValues)}
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
                            </>
                        );
                        return (
                            <Form layout="vertical">
                                <Form.Item name="title" required label="Title:">
                                    <Input name="title" />
                                </Form.Item>
                                <Form.Item name="description" required label="Description:">
                                    <Input.TextArea
                                        onChange={(e) => setValues({ ...values, description: e.target.value })}
                                        name="description"
                                        autoSize={{ minRows: 5, maxRows: 5 }}
                                    />
                                </Form.Item>
                                <Form.Item name="price" required label="Price:" className="w-full">
                                    <Input
                                        name="price"
                                        prefix="$"
                                        suffix="USD"
                                        style={{ width: '100%' }}
                                        className="w-full"
                                    />
                                </Form.Item>
                                <Form.Item label="Ingredients:" required name="ingredients">
                                    {ingredients}
                                </Form.Item>
                                <Form.Item label="Weight:" required name="Weight">
                                    <InputNumber min={1} name="weight" />
                                    cal
                                </Form.Item>
                                <Form.Item required label="Preparation Time:" name="preparationTime">
                                    <div className="flex flex-row space-x-3 items-center">
                                        <InputNumber min={1} name="preparationTime" />
                                        <span>minutes</span>
                                    </div>
                                </Form.Item>
                                <div className="w-full flex flex-col mb-5">
                                    <label>
                                        <span style={{ fontFamily: 'SimSun, sans-serif' }} className="text-red-500">
                                            *
                                        </span>{' '}
                                        Plate&apos;s photo:
                                    </label>
                                    <ImageUpload
                                        errors={errors}
                                        fieldName="image"
                                        setFieldError={setFieldError}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        values={values}
                                    />
                                </div>
                                <div className="w-full flex flex-row space-x-4">
                                    <SubmitButton loading={controller.isLoading}>Submit</SubmitButton>
                                    <Button
                                        disabled={controller.isLoading}
                                        onClick={controller.handleOpen}
                                        type="default"
                                    >
                                        {' '}
                                        Cancel{' '}
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        </Fragment>
    );
};
