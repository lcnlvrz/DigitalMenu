import React from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Select, SubmitButton, Form } from 'formik-antd';
import { RestaurantInterface, RestaurantReducerInterface } from '../../interfaces/Restaurant/restaurant.interface';
import { Formik } from 'formik';
import { ScheduleSchema } from '../../schema/Schedule/schedule.schema';
import { Button, message, TimePicker, Tooltip } from 'antd';
import moment from 'moment';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { daysOfTheWeek } from '../../controllers/modal-create-restaurant';
import { useModalEditSchedule } from '../../controllers/modal-edit-schedule';

export interface ModalEditScheduleProps {
    handleOpen: () => void;
    handleSubmit: (input: Partial<RestaurantInterface>, clearState?: () => void, handleOpen?: () => void) => void;
    isVisible: boolean;
    isLoading: boolean;
    restaurant: RestaurantReducerInterface;
}

export const ModalEditSchedule = (props: ModalEditScheduleProps) => {
    const controller = useModalEditSchedule({ handleOpen: props.handleOpen });

    return (
        <Modal
            closable={false}
            destroyOnClose
            footer={null}
            title="Schedule Config"
            onCancel={props.handleOpen}
            visible={props.isVisible}
        >
            <Formik
                onSubmit={(values) => {
                    if (values.schedule) {
                        controller.saveChanges(values.schedule);
                    }
                }}
                initialValues={{ schedule: props.restaurant.schedule }}
                validationSchema={ScheduleSchema}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-row space-x-5">
                                <Button
                                    onClick={() => {
                                        if (!values.schedule) return;
                                        controller.addNewDay(values.schedule, setFieldValue);
                                    }}
                                    type="primary"
                                    size="small"
                                    icon={<PlusOutlined />}
                                >
                                    {' '}
                                    Add Day{' '}
                                </Button>
                            </div>
                            <Form.Item
                                style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}
                                name="schedule"
                            >
                                {values.schedule?.map((dayAndHour, index) => (
                                    <div
                                        className="w-full 400:flex-col 400:space-x-0 400:items-start 400:space-y-2 flex flex-row space-x-5 items-center"
                                        key={index}
                                    >
                                        <div className="flex gap-4 flex-row">
                                            <Select
                                                notFoundContent="All days of the week selected"
                                                style={{ width: '150px' }}
                                                value={dayAndHour.day}
                                                onSelect={(v) => {
                                                    const newState = values.schedule ? [...values.schedule] : [];
                                                    newState[index].day = v;
                                                    setFieldValue('schedule', newState);
                                                }}
                                                name="scheduleDays"
                                                options={daysOfTheWeek.filter(
                                                    (day) =>
                                                        values.schedule?.findIndex((val) => val.day === day.value) ===
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
                                                    const newState = values.schedule ? [...values.schedule] : [];
                                                    newState[index].hour = stringFormat;
                                                    setFieldValue('schedule', newState);
                                                }}
                                                format="HH:mm"
                                            />
                                        </div>
                                        <Tooltip title="Remove Day">
                                            <button
                                                onClick={() => {
                                                    if (values.schedule?.length === 1) {
                                                        message.error('Schedule is required!');
                                                    } else {
                                                        const newState = values.schedule ? [...values.schedule] : [];
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
                            <div className="w-full flex flex-row space-x-5">
                                <SubmitButton> Save Changes </SubmitButton>
                                <Button
                                    onClick={() => props.handleOpen()}
                                    disabled={controller.isLoading}
                                    type="default"
                                >
                                    {' '}
                                    Cancel{' '}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
