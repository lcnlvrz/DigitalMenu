import { InfoCircleOutlined, InfoOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useTables } from '../../controllers/tables.controller';
import { Form, Input, InputNumber, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import { TableSchema, UpdateTableSchema } from '../../schema/Table/table.schema';
import { Button, Tooltip, Table, Input as InputAntd } from 'antd';

const Tables = () => {
    const controller = useTables();

    const modalCreateTable = (
        <Modal destroyOnClose title="Add a table" closable={false} footer={null} visible={controller.visible}>
            <Formik
                initialValues={{ name: '', securityPassword: '' }}
                onSubmit={(values) => controller.createTable(values)}
                validationSchema={TableSchema}
            >
                <Form className="my-5" layout="vertical">
                    <Form.Item label="Name:" name="name">
                        <Input name="name" />
                    </Form.Item>
                    <Form.Item label="Security Password:" name="securityPassword">
                        <Input.Password
                            prefix={
                                <Tooltip
                                    style={{ margin: '0px 20px' }}
                                    title="The security password is the secret key that your customers/employeers will type for confirm a order"
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                            }
                            name="securityPassword"
                        />
                    </Form.Item>
                    <div className="w-full items-center justify-center flex flex-row space-x-5">
                        <SubmitButton loading={controller.isLoading}> Save </SubmitButton>
                        <Button onClick={controller.handleOpen} disabled={controller.isLoading} type="default">
                            {' '}
                            Cancel{' '}
                        </Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    );

    const modalEditTable = (
        <Modal destroyOnClose title="Edit a table" closable={false} footer={null} visible={controller.visibleEdit}>
            <Formik
                onSubmit={(values) => controller.updateTable(values)}
                initialValues={
                    { name: controller.currentTable?.name, securityPassword: '' } || { name: '', securityPassword: '' }
                }
                validationSchema={UpdateTableSchema}
            >
                {({ errors }) => (
                    <Form layout="vertical">
                        <Form.Item label="Name:" name="name">
                            <Input name="name" />
                        </Form.Item>
                        <Form.Item label="Change Security Password:" name="securityPassword">
                            <Input.Password name="securityPassword" />
                            {!errors.securityPassword && (
                                <div className="flex flex-row items-center space-x-2">
                                    <InfoOutlined style={{ color: '#3B82F6' }} />
                                    <p className="m-0">
                                        {' '}
                                        For security risks, the current security password won&apos;t show{' '}
                                    </p>
                                </div>
                            )}
                        </Form.Item>
                        <div className="w-full items-center justify-center flex flex-row space-x-5">
                            <SubmitButton loading={controller.isLoading}> Save Changes</SubmitButton>
                            <Button onClick={controller.handleOpenEdit} disabled={controller.isLoading} type="default">
                                {' '}
                                Cancel{' '}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );

    const modalSendSecurityPasswords = (
        <Modal
            title="Security Passwords"
            destroyOnClose
            closable={false}
            footer={null}
            visible={controller.visibleSecurityPasswords}
        >
            <div className="w-full mb-5 flex flex-row items-start">
                <p>
                    For security risks, we will not show the security passwords inside the panel. For get these ones, we
                    can send you an email with all keys.
                </p>
            </div>
            <div className="w-full flex flex-col items-start space-y-5">
                <div>
                    <label>Your current email:</label>
                    <InputAntd value={controller.user.email} readOnly />
                </div>
                <div className="flex flex-row space-x-3">
                    <Button loading={controller.isLoading} onClick={controller.sendSecurityPasswords} type="primary">
                        {' '}
                        Send Email{' '}
                    </Button>
                    <Button
                        disabled={controller.isLoading}
                        onClick={controller.handleOpenSecurityPasswords}
                        type="default"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );

    return (
        <div className="p-5">
            <div className="w-full flex flex-row justify-between 600:flex-col 600:items-start 600:space-y-5">
                <div className="flex flex-row items-center space-x-10">
                    <h1 className="text-3xl m-0 text-gray-800 font-bold">TABLES</h1>
                    <button
                        onClick={controller.handleOpen}
                        className="bg-red-500 py-1 px-3 rounded hover:bg-red-800 transition-all text-white font-semibold flex flex-row items-center space-x-2"
                    >
                        <PlusOutlined className="text-lg" />
                        <span className="text-lg">Table</span>
                    </button>
                </div>
                <Button onClick={controller.handleOpenSecurityPasswords} icon={<KeyOutlined />} type="primary">
                    Get Security Passwords
                </Button>
            </div>
            {modalCreateTable}
            {modalEditTable}
            {modalSendSecurityPasswords}
            <Table
                scroll={{ x: 400 }}
                loading={controller.isLoading}
                style={{ margin: '2rem 0' }}
                pagination={false}
                dataSource={controller.tables?.map((table, index) => ({ ...table, key: index }))}
                columns={[
                    {
                        dataIndex: 'id',
                        title: 'ID',
                        render: function RenderId(value, table) {
                            return <p className="font-semibold m-0">{value}</p>;
                        },
                        className: 'text-lg',
                    },
                    {
                        dataIndex: 'name',
                        title: 'Name',
                        className: 'text-lg',
                        render: function RenderName(value) {
                            return <p className="m-0 font-light">{value}</p>;
                        },
                    },
                    {
                        dataIndex: 'actions',
                        title: 'Actions',
                        className: 'text-lg',
                        render: function RenderActions(_, table) {
                            return (
                                <div className="w-full flex flex-row space-x-5 items-center">
                                    <button
                                        onClick={() => {
                                            controller.setCurrentTable(table);
                                            controller.handleOpenEdit();
                                        }}
                                        className="active:outline-none focus:outline-none bg-red-500 rounded-full py-1 px-4 shadow-lg hover:bg-red-800 transition-all text-white"
                                    >
                                        Edit
                                    </button>
                                    <p
                                        onClick={() => controller.removeTable(table.id)}
                                        className="text-red-500 hover:underline transition-all cursor-pointer hover:text-red-800 m-0"
                                    >
                                        Delete
                                    </p>
                                </div>
                            );
                        },
                    },
                ]}
            />
        </div>
    );
};

export default Tables;
