import React from 'react';
import { Modal, TimePicker, Button, message, Tooltip } from 'antd';
import { useModalCreateRestaurant } from '../../controllers/modal-create-restaurant';
import { Form, Input, SubmitButton, InputNumber, Switch, Select } from 'formik-antd';
import { Formik } from 'formik';
import { RestaurantSchema } from '../../schema/Restaurant/restaurant.schema';
import { RestaurantInitialValue } from '../../initial-values/Restaurant/restaurant.initial-value';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

export const ModalCreateRestaurant = (): JSX.Element => {
    const controller = useModalCreateRestaurant();

    return (
        <Modal
            closable={false}
            footer={null}
            title={<h1 className="font-semibold text-2xl"> Create Restaurant </h1>}
            closeIcon={null}
            visible={controller.isOpen}
        >
            <p className="font-normal">
                It seems like it&apos;s your first time here. First of all, create your restaurant filling out the
                following form:
            </p>
            <Formik
                onSubmit={(values) => controller.createRestaurant(values)}
                initialValues={RestaurantInitialValue}
                validationSchema={RestaurantSchema}
            >
                {({ setValues, values, setFieldValue }) => (
                    <Form layout="vertical">
                        <Form.Item label="Name:" name="name" required>
                            <Input name="name" />
                        </Form.Item>
                        <Form.Item label="Description:" id="description" name="description" required>
                            <Input.TextArea
                                onChange={(e) => {
                                    setValues({ ...values, description: e.target.value });
                                }}
                                autoSize={{ maxRows: 3, minRows: 3 }}
                                name="description"
                            />
                        </Form.Item>
                        <Form.Item label="Location:" name="location" required>
                            <Input name="location" />
                        </Form.Item>
                        <div className="flex flex-col space-y-5 my-5">
                            <div className="flex flex-row space-x-5">
                                <label>
                                    <span className="text-red-500 font-sans">*</span> Schedule:
                                </label>
                                <Button
                                    onClick={() => controller.addNewDay(values.schedule, setFieldValue)}
                                    type="primary"
                                    size="small"
                                    icon={<PlusOutlined />}
                                >
                                    {' '}
                                    Add Day{' '}
                                </Button>
                            </div>
                            <Form.Item required style={{ display: 'flex', flexDirection: 'column' }} name="schedule">
                                {values.schedule.map((dayAndHour, index) => (
                                    <div className="w-full flex flex-row space-x-5 items-center" key={index}>
                                        <div className="flex gap-4 flex-row">
                                            <Select
                                                notFoundContent="All days of the week selected"
                                                style={{ width: '150px' }}
                                                value={dayAndHour.day}
                                                onSelect={(v) => {
                                                    const newState = [...values.schedule];
                                                    newState[index].day = v;
                                                    setFieldValue('schedule', newState);
                                                }}
                                                name="scheduleDays"
                                                options={controller.daysOfTheWeek.filter(
                                                    (day) =>
                                                        values.schedule.findIndex((val) => val.day === day.value) ===
                                                        -1,
                                                )}
                                            />
                                            <TimePicker.RangePicker
                                                value={[
                                                    moment(dayAndHour.hour[0], 'HH:mm'),
                                                    moment(dayAndHour.hour[1], 'HH:mm'),
                                                ]}
                                                clearIcon={null}
                                                onChange={(_, stringFormat) => {
                                                    const newState = [...values.schedule];
                                                    newState[index].hour = stringFormat;
                                                    setFieldValue('schedule', newState);
                                                }}
                                                format="HH:mm"
                                            />
                                        </div>
                                        <Tooltip title="Remove Day">
                                            <button
                                                onClick={() => {
                                                    if (values.schedule.length === 1) {
                                                        message.error('Schedule is required!');
                                                    } else {
                                                        const newState = [...values.schedule];
                                                        newState.splice(index, 1);
                                                        setFieldValue('schedule', newState);
                                                    }
                                                }}
                                            >
                                                <DeleteOutlined className="cursor-pointer" style={{ color: 'red' }} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                ))}
                            </Form.Item>
                        </div>
                        <Form.Item label="Cellphone:" name="cellphone" required>
                            <InputNumber style={{ width: '100%' }} name="cellphone" />
                        </Form.Item>
                        <Form.Item label="Delivery:" name="isDelivery" required>
                            <Switch
                                unCheckedChildren={<span> No </span>}
                                checkedChildren={<span> Yes </span>}
                                name="isDelivery"
                            />
                        </Form.Item>
                        <Form.Item label="Payment Method accepted:" name="hasOtherPaymentMethod" required>
                            <Switch
                                unCheckedChildren={<span> Only effective </span>}
                                checkedChildren={<span> Effective and others </span>}
                                name="hasOtherPaymentMethod"
                            />
                        </Form.Item>
                        <SubmitButton loading={controller.isLoading}> Create Restaurant </SubmitButton>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
