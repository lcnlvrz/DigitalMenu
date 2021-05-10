import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Spin, Select as SelectAntd, Input as InputAntd, Button, Table, Switch as SwitchAntd } from 'antd';
import { CampaingTriggered, useCampaingsV2 } from '../../controllers/campaings-v2.controller';
import { Formik } from 'formik';
import { CampaingV2Schema } from '../../schema/Campaingv2/campaingv2.schema';
import { Form, Input, Switch, Select, SubmitButton, InputNumber } from 'formik-antd';
import { LabeledValue } from 'antd/lib/select';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useMediaQuery } from 'react-responsive';

const Campaingsv2 = () => {
    const controller = useCampaingsV2();

    const isMax500 = useMediaQuery({ maxWidth: '500px' });

    const dataSource = controller.restaurant?.campaings
        ? controller.restaurant.campaings.map((campaing, index) => ({ ...campaing, key: index }))
        : [];

    const modalCreateCampaing = (
        <Modal destroyOnClose title="Create a Campaing" closable={false} footer={null} visible={controller.visible}>
            <Formik
                onSubmit={(values) => controller.createCampaing(values)}
                validationSchema={CampaingV2Schema}
                initialValues={controller.initValuesCreateCampaing}
            >
                {({ values, errors, touched, setValues, setFieldValue, setFieldTouched, setFieldError, resetForm }) => (
                    <Form layout="vertical">
                        <Form.Item required label="Title:" name="title">
                            <Input name="title" />
                        </Form.Item>
                        <Form.Item required label="Description:" name="description">
                            <InputAntd.TextArea
                                value={values.description}
                                onBlur={() => setFieldTouched('description', true)}
                                onChange={(e) => setFieldValue('description', e.target.value)}
                                autoSize={{ maxRows: 3, minRows: 3 }}
                                rows={3}
                                name="description"
                            />
                        </Form.Item>
                        <div className="my-5">
                            <Form.Item
                                required
                                style={{ display: 'flex', flexDirection: isMax500 ? 'column' : 'row' }}
                                name="willTriggeredWhen"
                            >
                                <label>
                                    <span style={{ fontFamily: 'SimSun, sans-serif' }} className="text-red-500">
                                        *
                                    </span>{' '}
                                    Campaing will triggered when:
                                </label>
                                <SelectAntd
                                    style={{ width: '150px' }}
                                    labelInValue
                                    filterOption={false}
                                    value={values.willTriggeredWhen}
                                    onSelect={(v) =>
                                        setValues({
                                            ...values,
                                            willTriggeredWhen: v,
                                            startsWhenSelectedPlate: undefined,
                                            startsAfterSeconds: undefined,
                                            startsWhenSelectedMenu: undefined,
                                        })
                                    }
                                    options={controller.willTriggeredWhenOptions as any}
                                />
                            </Form.Item>
                            {(() => {
                                switch (values.willTriggeredWhen.value) {
                                    case CampaingTriggered.MENU_SELECTED:
                                        return (
                                            <div className="flex flex-row space-x-3 items-start justify-center">
                                                <label className="mt-1">
                                                    {isMax500 ? 'Starts when:' : 'Campaing Starts When:'}
                                                </label>
                                                <Form.Item name="startsWhenSelectedMenu">
                                                    <Select
                                                        allowClear
                                                        name="startsWhenSelectedMenu"
                                                        style={{ width: '150px' }}
                                                        showSearch
                                                        placeholder="Any Menu..."
                                                        notFoundContent={
                                                            controller.isLoadingQuery ? (
                                                                <Spin size="small" />
                                                            ) : !controller.menuQueryRequest ? (
                                                                'Type for search'
                                                            ) : (
                                                                'Not found results'
                                                            )
                                                        }
                                                        onSelect={(v) =>
                                                            setValues({
                                                                ...values,
                                                                startsWhenSelectedMenu: v as LabeledValue,
                                                            })
                                                        }
                                                        onSearch={(v) => controller.setMenuQueryRequest(v)}
                                                        labelInValue
                                                        options={controller.optionsMenu}
                                                        filterOption={false}
                                                    />
                                                </Form.Item>
                                                <span className="mt-1">selected</span>
                                            </div>
                                        );

                                    case CampaingTriggered.PLATE_SELECTED:
                                        return (
                                            <div className="w-full flex items-start justify-center space-x-3">
                                                <label className="mt-1">
                                                    {isMax500 ? 'Starts when:' : 'Campaing Starts When:'}
                                                </label>
                                                <Form.Item name="startsWhenSelectedPlate">
                                                    <Select
                                                        allowClear
                                                        name="startsWhenSelectedPlate"
                                                        style={{ width: '150px' }}
                                                        showSearch
                                                        placeholder="Any Plate..."
                                                        onSelect={(v) =>
                                                            setValues({
                                                                ...values,
                                                                startsWhenSelectedPlate: v as LabeledValue,
                                                            })
                                                        }
                                                        onSearch={(v) => controller.setPlateQueryRequest(v)}
                                                        value={values.startsWhenSelectedPlate}
                                                        notFoundContent={
                                                            controller.isLoadingQuery ? (
                                                                <Spin size="small" />
                                                            ) : !controller.plateQueryRequest ? (
                                                                'Type for search'
                                                            ) : (
                                                                'Not found results'
                                                            )
                                                        }
                                                        labelInValue
                                                        options={controller.optionsPlate}
                                                        filterOption={false}
                                                    />
                                                </Form.Item>
                                                <span className="mt-1">selected</span>
                                            </div>
                                        );

                                    default:
                                        return (
                                            <div className="w-full flex items-start justify-center space-x-3">
                                                <label className="mt-1">
                                                    {isMax500 ? 'Starts after:' : 'Campaing starts after:'}
                                                </label>
                                                <Form.Item name="startsAfterSeconds">
                                                    <InputNumber
                                                        placeholder="Number"
                                                        min={1}
                                                        name="startsAfterSeconds"
                                                    />
                                                </Form.Item>
                                                <span className="mt-1">seconds</span>
                                            </div>
                                        );
                                }
                            })()}
                        </div>
                        <div className="flex flex-row space-x-3 my-2 500:flex-col 500:items-start 500:space-x-0">
                            <label>
                                <span style={{ fontFamily: 'SimSun, sans-serif' }} className="text-red-500">
                                    *
                                </span>{' '}
                                Banner:
                            </label>
                            <ImageUpload
                                errors={errors}
                                fieldName="banner"
                                setFieldTouched={setFieldTouched}
                                setFieldError={setFieldError}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                values={values}
                            />
                        </div>
                        <div className="flex flex-row space-x-2 my-2 500:flex-col 500:items-start 500:space-x-0">
                            <label>
                                <span style={{ fontFamily: 'SimSun, sans-serif' }} className="text-red-500">
                                    *
                                </span>{' '}
                                Content:
                            </label>
                            <ImageUpload
                                errors={errors}
                                fieldName="content"
                                setFieldTouched={setFieldTouched}
                                setFieldError={setFieldError}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                values={values}
                            />
                        </div>
                        <Form.Item
                            required
                            name="publish"
                            style={{ display: 'flex', alignItems: 'row', justifyContent: 'start' }}
                        >
                            <label>
                                <span style={{ fontFamily: 'SimSun, sans-serif' }} className="text-red-500">
                                    *
                                </span>{' '}
                                Publish:
                            </label>
                            <Switch name="publish" />
                        </Form.Item>
                        <div className="flex w-full items-center justify-center flex-row space-x-2">
                            <SubmitButton>Save</SubmitButton>
                            <Button disabled={controller.isLoading} onClick={controller.handleVisible}>
                                {' '}
                                Cancel{' '}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );

    const modalEditCampaing = (
        <Modal
            destroyOnClose
            title="Edit a Campaing"
            closable={false}
            footer={null}
            visible={controller.currentCampaingEdit ? true : false}
        >
            <Formik
                onSubmit={(values) => controller.updateCampaing(values)}
                validationSchema={CampaingV2Schema}
                initialValues={controller.initialValuesEditCampaing}
            >
                {({ values, errors, touched, setValues, setFieldValue, setFieldTouched, setFieldError }) => (
                    <Form layout="vertical">
                        <Form.Item label="Title" name="title">
                            <Input name="title" />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <InputAntd.TextArea
                                value={values?.description}
                                onBlur={() => setFieldTouched('description', true)}
                                onChange={(e) => setFieldValue('description', e.target.value)}
                                autoSize={{ maxRows: 3, minRows: 3 }}
                                rows={3}
                                name="description"
                            />
                        </Form.Item>
                        <div className="my-5">
                            <Form.Item style={{ display: 'flex', flexDirection: 'row' }} name="willTriggeredWhen">
                                <label>Campaign will triggered when:</label>
                                <SelectAntd
                                    style={{ width: '150px' }}
                                    labelInValue
                                    filterOption={false}
                                    value={values.willTriggeredWhen}
                                    onSelect={(v) =>
                                        setValues({
                                            ...values,
                                            willTriggeredWhen: v,
                                            startsWhenSelectedPlate: undefined,
                                            startsAfterSeconds: undefined,
                                            startsWhenSelectedMenu: undefined,
                                        })
                                    }
                                    options={controller.willTriggeredWhenOptions as any}
                                />
                            </Form.Item>
                            {(() => {
                                switch (values.willTriggeredWhen.value) {
                                    case CampaingTriggered.MENU_SELECTED:
                                        return (
                                            <div className="flex flex-row space-x-3 items-start justify-center">
                                                <label>Campaing starts when:</label>
                                                <Form.Item name="startsWhenSelectedMenu">
                                                    <Select
                                                        allowClear
                                                        name="startsWhenSelectedMenu"
                                                        style={{ width: '150px' }}
                                                        showSearch
                                                        placeholder="Any Menu..."
                                                        notFoundContent={
                                                            controller.isLoadingQuery ? (
                                                                <Spin size="small" />
                                                            ) : !controller.menuQueryRequest ? (
                                                                'Type for search'
                                                            ) : (
                                                                'Not found results'
                                                            )
                                                        }
                                                        onSelect={(v) =>
                                                            setValues({
                                                                ...values,
                                                                startsWhenSelectedMenu: v as LabeledValue,
                                                            })
                                                        }
                                                        onSearch={(v) => controller.setMenuQueryRequest(v)}
                                                        labelInValue
                                                        options={controller.optionsMenu}
                                                        filterOption={false}
                                                    />
                                                </Form.Item>
                                                <span>selected</span>
                                            </div>
                                        );

                                    case CampaingTriggered.PLATE_SELECTED:
                                        return (
                                            <div className="w-full flex items-start justify-center space-x-3">
                                                <label>Campaing starts when:</label>
                                                <Form.Item name="startsWhenSelectedPlate">
                                                    <Select
                                                        allowClear
                                                        name="startsWhenSelectedPlate"
                                                        style={{ width: '150px' }}
                                                        showSearch
                                                        placeholder="Any Plate..."
                                                        onSelect={(v) =>
                                                            setValues({
                                                                ...values,
                                                                startsWhenSelectedPlate: v as LabeledValue,
                                                            })
                                                        }
                                                        onSearch={(v) => controller.setPlateQueryRequest(v)}
                                                        value={values.startsWhenSelectedPlate}
                                                        notFoundContent={
                                                            controller.isLoadingQuery ? (
                                                                <Spin size="small" />
                                                            ) : !controller.plateQueryRequest ? (
                                                                'Type for search'
                                                            ) : (
                                                                'Not found results'
                                                            )
                                                        }
                                                        labelInValue
                                                        options={controller.optionsPlate}
                                                        filterOption={false}
                                                    />
                                                </Form.Item>
                                                <span>selected</span>
                                            </div>
                                        );

                                    default:
                                        return (
                                            <div className="w-full flex items-start justify-center space-x-3">
                                                <label>Campaing starts after:</label>
                                                <Form.Item name="startsAfterSeconds">
                                                    <InputNumber
                                                        placeholder="Number"
                                                        min={1}
                                                        name="startsAfterSeconds"
                                                    />
                                                </Form.Item>
                                                <span>seconds</span>
                                            </div>
                                        );
                                }
                            })()}
                        </div>
                        <div className="flex flex-row space-x-2 my-2">
                            <label>Banner:</label>
                            <ImageUpload
                                initialImage={typeof values.banner === 'string' ? values.banner : undefined}
                                errors={errors}
                                fieldName="banner"
                                setFieldTouched={setFieldTouched}
                                setFieldError={setFieldError}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                values={values}
                            />
                        </div>
                        <div className="flex flex-row space-x-2 my-2">
                            <label>Content:</label>
                            <ImageUpload
                                initialImage={typeof values.content === 'string' ? values.content : undefined}
                                errors={errors}
                                fieldName="content"
                                setFieldTouched={setFieldTouched}
                                setFieldError={setFieldError}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                values={values}
                            />
                        </div>
                        <Form.Item
                            name="publish"
                            style={{ display: 'flex', alignItems: 'row', justifyContent: 'start' }}
                        >
                            <span>Publish</span>
                            <Switch name="publish" />
                        </Form.Item>
                        <div className="flex w-full items-center justify-center flex-row space-x-2">
                            <SubmitButton>Save</SubmitButton>
                            <Button
                                disabled={controller.isLoading}
                                onClick={() => controller.setCurrentCampaingEdit(undefined)}
                            >
                                {' '}
                                Cancel{' '}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );

    return (
        <div className="p-5 w-full">
            <div className="flex flex-row 550:flex-col 550:justify-start 550:space-y-5 550:items-start items-center justify-between w-3/4">
                <h1 className="text-3xl text-gray-800 m-0 font-bold">CAMPAINGS</h1>
                <button
                    onClick={controller.handleVisible}
                    className="bg-red-500 transition-all hover:bg-red-800 rounded items-center space-x-3 justify-center h-10 py-0 px-3 text-white font-semibold flex flex-row "
                >
                    <PlusOutlined />
                    <span> Campaign </span>
                </button>
                {modalCreateCampaing}
                {modalEditCampaing}
            </div>
            {!dataSource.length ? (
                <div className="w-full items-center justify-center my-5">
                    <p className="font-light text-lg">
                        You don&apos;t any campaing published. Create one and see something
                    </p>
                </div>
            ) : (
                <Table
                    loading={controller.isLoading}
                    scroll={{ x: 500 }}
                    style={{ margin: '1rem 0' }}
                    columns={[
                        {
                            key: 'title',
                            dataIndex: 'title',
                            title: 'Title',
                            render: function RenderTitle(v) {
                                return <span className="font-semibold">{v}</span>;
                            },
                            align: 'center',
                        },
                        { key: 'description', dataIndex: 'description', title: 'Description', ellipsis: true },
                        {
                            key: 'willTriggeredWhen',
                            dataIndex: 'willTriggeredWhen',
                            title: 'Trigger Type',
                            render: function RenderType(v) {
                                switch (v) {
                                    case CampaingTriggered.CERTAIN_TIME:
                                        return <span>Certain Time</span>;

                                    case CampaingTriggered.MENU_SELECTED:
                                        return <span>Menu Selected</span>;

                                    case CampaingTriggered.PLATE_SELECTED:
                                        return <span>Plate Selected</span>;

                                    default:
                                        return null;
                                }
                            },
                            align: 'center',
                        },
                        {
                            key: 'publish',
                            dataIndex: 'publish',
                            title: 'Publish',
                            render: function RenderPublish(value, campaing) {
                                return (
                                    <SwitchAntd
                                        onChange={() => controller.changePublish(campaing.id)}
                                        checked={value}
                                    />
                                );
                            },
                            align: 'center',
                        },
                        {
                            key: 'actions',
                            dataIndex: 'actions',
                            title: 'Actions',
                            render: function RenderActions(_, campaing) {
                                return (
                                    <div className="flex flex-row space-x-3 items-center cursor-pointer">
                                        <button
                                            onClick={() => controller.setCurrentCampaingEdit(campaing)}
                                            className="bg-red-500 text-white font-semibold h-7 px-3 hover:bg-red-800 transition-all rounded"
                                        >
                                            View
                                        </button>
                                        <span
                                            onClick={() => controller.deleteCampaing(campaing.id)}
                                            className="text-red-500 hover:text-red-800 transition-all"
                                        >
                                            Delete
                                        </span>
                                    </div>
                                );
                            },
                            align: 'center',
                        },
                    ]}
                    dataSource={dataSource}
                />
            )}
        </div>
    );
};

export default Campaingsv2;
