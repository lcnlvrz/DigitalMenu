import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, Spin, Tag, Tooltip, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Formik } from 'formik';
import React, { Fragment } from 'react';
import { FaRegKissWinkHeart, FaRegSadCry } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { EmojiStatus, useCustomerOrderPortal } from '../../controllers/customer-order-portal.controller';
import { OrderStatus } from '../../services/order.service';
import { Input, Rate, SubmitButton, Form, Radio } from 'formik-antd';
import { FaMeh, FaSadCry, FaSmile } from 'react-icons/fa';
import { TypesQuestion } from '../../controllers/create-survey-form.controller';
import * as Yup from 'yup';

const CustomerOrderPortal = () => {
    const controller = useCustomerOrderPortal();

    const orderSummary = (
        <div className="text-center">
            <ul className="flex flex-col space-y-5 max-h-36 overflow-y-scroll">
                {controller.order.plates?.map((plate, index) => (
                    <Fragment key={index}>
                        <li className="flex flex-row space-x-8 items-center justify-between">
                            <Typography.Paragraph ellipsis={{ rows: 1 }} className="font-semibold">
                                {plate.quantity}x
                            </Typography.Paragraph>
                            <div className="flex flex-col items-start justify-center font-semibold m-0 w-full">
                                <div className="text-left w-full">
                                    <Typography.Paragraph style={{ margin: 0 }}>{plate.title}</Typography.Paragraph>
                                </div>
                                <Typography.Paragraph style={{ margin: 0, color: 'gray' }}>
                                    {plate.weight}gr
                                </Typography.Paragraph>
                            </div>
                            <p className="text-yellow-400 font-semibold text-lg m-0">${plate.subtotal}</p>
                        </li>
                        <Divider />
                    </Fragment>
                ))}
            </ul>
            <section className="flex flex-col space-y-3">
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-lg m-0"> Total </h3>
                    <p className="text-3xl m-0">${controller.order.total}</p>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-lg m-0"> Status </h3>
                    <Tooltip title={controller.titleTooptipStatus}>
                        <Tag
                            style={{ margin: 0, cursor: 'pointer' }}
                            color={
                                controller.order.status === OrderStatus.IN_QUEUE
                                    ? 'default'
                                    : controller.order.status === OrderStatus.DONE
                                    ? 'success'
                                    : controller.order.status === OrderStatus.WITH_DELAY
                                    ? 'warning'
                                    : controller.order.status === OrderStatus.DELIVERED
                                    ? 'geekblue'
                                    : 'error'
                            }
                        >
                            {controller.order.status === OrderStatus.IN_QUEUE && 'In queue'}
                            {controller.order.status === OrderStatus.WITH_DELAY && 'With delay'}
                            {controller.order.status === OrderStatus.COOKING && 'Cooking'}
                            {controller.order.status === OrderStatus.DONE && 'Done'}
                            {controller.order.status === OrderStatus.DELIVERED && 'Delivered'}
                            {controller.order.status === OrderStatus.CANCELED && 'Canceled'}
                        </Tag>
                    </Tooltip>
                </div>
                {controller.order.status !== OrderStatus.DONE && (
                    <Button
                        onClick={controller.fetchOrder}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        icon={<ReloadOutlined />}
                    >
                        Fetch New Status
                    </Button>
                )}
            </section>
        </div>
    );

    if (controller.isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    if (!controller.order.id) {
        return (
            <div className="h-screen flex items-center justify-center flex-col">
                <FaRegSadCry className="text-8xl text-blue-500" />
                <h1 className="text-3xl m-0"> This order doesn&apos;t exist </h1>
                <p className="text-lg text-gray-700">Did you get lost?</p>
                <Link to="/">
                    <Button
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        icon={<HomeOutlined />}
                        type="primary"
                    >
                        Go Home
                    </Button>
                </Link>
            </div>
        );
    }

    if (controller.isSucessSurveyForm && controller.order.id) {
        return (
            <div className="h-screen flex items-center justify-center flex-col p-5 space-y-3">
                <FaRegKissWinkHeart className="text-8xl text-red-500" />
                <div className="text-center">
                    <h1 className="text-3xl m-0">Thank you so much for visit {controller.order.restaurant?.name}</h1>
                    <p className="m-0 text-lg">We hope see you again!</p>
                </div>
            </div>
        );
    }

    if (
        controller.order.status === OrderStatus.DONE &&
        !controller.order.review &&
        controller.order.restaurant?.surveyForms.length
    ) {
        return (
            <Modal
                visible
                closable={false}
                closeIcon={null}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                footer={null}
                onCancel={controller.handleOpen}
            >
                <Formik
                    initialValues={controller.initialValuesFormik}
                    validationSchema={Yup.object().shape({ ...controller.validationSchema() })}
                    onSubmit={controller.sendResponse}
                >
                    {({ values, setValues, setFieldValue }) =>
                        controller.order.restaurant?.surveyForms && (
                            <Form
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    flexDirection: 'column',
                                }}
                                layout="vertical"
                            >
                                <div className="w-full text-center">
                                    <h1 className="text-2xl"> {controller.order.restaurant.surveyForms[0].header} </h1>
                                </div>
                                {controller.order.restaurant.surveyForms[0].questions.map((question, index) => {
                                    const fieldName = index.toString();
                                    switch (question.type) {
                                        case TypesQuestion.RATING:
                                            return (
                                                <Form.Item name={fieldName} key={index}>
                                                    <div className="w-full text-center">
                                                        <p className="m-0 font-semibold">
                                                            {question.isMandatoryQuestion && (
                                                                <span
                                                                    style={{ fontFamily: 'SimSun, sans-serif' }}
                                                                    className="text-red-500"
                                                                >
                                                                    *
                                                                </span>
                                                            )}
                                                            {' ' + question.value}
                                                        </p>
                                                        <Rate
                                                            onChange={(val) => {
                                                                setFieldValue(fieldName, val);
                                                                controller.onChangeAnswer(question, index, val);
                                                            }}
                                                            defaultValue={1}
                                                            name={fieldName}
                                                        />
                                                    </div>
                                                </Form.Item>
                                            );

                                        case TypesQuestion.SMILEY:
                                            return (
                                                <Form.Item name={fieldName} key={index}>
                                                    <div className="w-full text-center">
                                                        <p className="m-0 font-semibold">
                                                            {question.isMandatoryQuestion && (
                                                                <span
                                                                    style={{ fontFamily: 'SimSun, sans-serif' }}
                                                                    className="text-red-500"
                                                                >
                                                                    *
                                                                </span>
                                                            )}
                                                            {' ' + question.value}
                                                        </p>
                                                        <div className="flex flex-row space-x-3 items-center justify-center text-4xl  mt-2">
                                                            <FaSadCry
                                                                onClick={() => {
                                                                    setValues({
                                                                        ...values,
                                                                        [fieldName]: EmojiStatus.SAD,
                                                                    });

                                                                    controller.onChangeAnswer(
                                                                        question,
                                                                        index,
                                                                        EmojiStatus.SAD,
                                                                    );
                                                                }}
                                                                className={`hover:text-yellow-300 ${
                                                                    values[fieldName] === EmojiStatus.SAD
                                                                        ? 'text-yellow-300'
                                                                        : 'text-gray-300'
                                                                }  transition-all cursor-pointer`}
                                                            />
                                                            <FaSmile
                                                                onClick={() => {
                                                                    setValues({
                                                                        ...values,
                                                                        [fieldName]: EmojiStatus.SMILE,
                                                                    });
                                                                    controller.onChangeAnswer(
                                                                        question,
                                                                        index,
                                                                        EmojiStatus.SMILE,
                                                                    );
                                                                }}
                                                                className={`hover:text-yellow-300 ${
                                                                    values[fieldName] === EmojiStatus.SMILE
                                                                        ? 'text-yellow-300'
                                                                        : 'text-gray-300'
                                                                }  transition-all cursor-pointer`}
                                                            />
                                                            <FaMeh
                                                                onClick={() => {
                                                                    setValues({
                                                                        ...values,
                                                                        [fieldName]: EmojiStatus.MEH,
                                                                    });
                                                                    controller.onChangeAnswer(
                                                                        question,
                                                                        index,
                                                                        EmojiStatus.MEH,
                                                                    );
                                                                }}
                                                                className={`hover:text-yellow-300 ${
                                                                    values[fieldName] === EmojiStatus.MEH
                                                                        ? 'text-yellow-300'
                                                                        : 'text-gray-300'
                                                                }  transition-all cursor-pointer`}
                                                            />
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                            );

                                        case TypesQuestion.YES_OR_NO:
                                            return (
                                                <Form.Item name={fieldName} key={index}>
                                                    <div className="w-full text-center">
                                                        <p className="m-0 font-semibold">
                                                            {question.isMandatoryQuestion && (
                                                                <span
                                                                    style={{ fontFamily: 'SimSun, sans-serif' }}
                                                                    className="text-red-500"
                                                                >
                                                                    *
                                                                </span>
                                                            )}
                                                            {' ' + question.value}
                                                        </p>
                                                        <Radio.Group
                                                            onChange={(e) =>
                                                                controller.onChangeAnswer(
                                                                    question,
                                                                    index,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            name={fieldName}
                                                            style={{ marginTop: '0.5rem' }}
                                                            className="mt-2"
                                                        >
                                                            <Radio name={fieldName} value="YES">
                                                                Yes
                                                            </Radio>
                                                            <Radio name={fieldName} value="NO">
                                                                No
                                                            </Radio>
                                                        </Radio.Group>
                                                    </div>
                                                </Form.Item>
                                            );

                                        case TypesQuestion.TEXT:
                                            return (
                                                <Form.Item
                                                    required={question.isMandatoryQuestion}
                                                    name={fieldName}
                                                    key={index}
                                                    labelAlign="left"
                                                    label={<label className="font-semibold">{question.value}</label>}
                                                >
                                                    <Input
                                                        onChange={(e) =>
                                                            controller.onChangeAnswer(question, index, e.target.value)
                                                        }
                                                        name={fieldName}
                                                    />
                                                </Form.Item>
                                            );
                                    }
                                })}
                                <SubmitButton htmlType="submit" type="primary">
                                    Send
                                </SubmitButton>
                            </Form>
                        )
                    }
                </Formik>
            </Modal>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center space-y-5 p-5">
            <div className="flex flex-col items-center">
                <GiPartyPopper className="text-6xl" />
                <h1 className="text-4xl m-0 500:text-2xl"> Thanks for your order! </h1>
                <p>{controller.order.restaurant?.name} is preparing your order as soon as possible</p>
            </div>
            {orderSummary}
        </div>
    );
};

export default CustomerOrderPortal;
