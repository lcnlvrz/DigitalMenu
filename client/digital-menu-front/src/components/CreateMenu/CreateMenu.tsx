import React, { Fragment } from 'react';
import { Button, Modal, Dropdown, Menu } from 'antd';
import { useCreateMenu } from '../../controllers/create-menu.controller';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from 'formik-antd';
import { MenuSchema } from '../../schema/Menu/menu.schema';
import { AiFillEye, AiFillEyeInvisible, AiFillDelete } from 'react-icons/ai';
import { ActionStatusMenuAndPlate } from '../../controllers/my-menu.controller';
import { ImPower } from 'react-icons/im';

export interface CreateMenuProps {
    selected: number[];
    isLoading: boolean;
    getMenusBySearch: (specialSuccessMessage?: string | undefined) => Promise<void>;
}

export const CreateMenu = (props: CreateMenuProps) => {
    const controller = useCreateMenu(props);

    const modal = (
        <Modal
            destroyOnClose
            footer={null}
            okText="Create"
            title="Create Menu"
            onCancel={controller.handleOpen}
            visible={controller.isOpenModal}
        >
            <Formik
                onSubmit={(values) => controller.createMenu(values)}
                validationSchema={MenuSchema}
                initialValues={{ name: '', description: '' }}
            >
                {({ values, setValues }) => (
                    <Form layout="vertical">
                        <Form.Item name="name" required label="Name:" labelAlign="right">
                            <Input name="name" placeholder="Recommend start with Menu of..." />
                        </Form.Item>
                        <Form.Item name="description" required label="Description:" labelAlign="right">
                            <Input.TextArea
                                onChange={(e) => setValues({ ...values, description: e.target.value })}
                                name="description"
                                autoSize={{ minRows: 5, maxRows: 5 }}
                                minLength={25}
                                maxLength={100}
                                placeholder="Shorter, as much as possible"
                            />
                        </Form.Item>
                        <br />
                        <SubmitButton loading={controller.isLoading} type="primary">
                            {' '}
                            Create{' '}
                        </SubmitButton>
                    </Form>
                )}
            </Formik>
        </Modal>
    );

    const menuActions = (
        <Menu>
            <Menu.Item
                onClick={() => controller.updateMenu(ActionStatusMenuAndPlate.PUBLISH, props.selected)}
                className="flex flex-row items-center space-x-2"
            >
                <AiFillEye />
                <span>Publish</span>
            </Menu.Item>
            <Menu.Item
                onClick={() => controller.updateMenu(ActionStatusMenuAndPlate.HIDE, props.selected)}
                className="flex flex-row items-center space-x-2"
            >
                <AiFillEyeInvisible />
                <span>Hide</span>
            </Menu.Item>
            <Menu.Item
                danger
                onClick={() => controller.removeMenu(props.selected)}
                className="flex flex-row items-center space-x-2"
            >
                <AiFillDelete />
                <span>Delete</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Fragment>
            <div className="flex flex-row space-x-4">
                <Dropdown trigger={['click']} disabled={!props.selected.length} overlay={menuActions}>
                    <Button>
                        <div className="w-full flex flex-row items-center space-x-2">
                            <ImPower />
                            <span>Menu Actions</span>
                        </div>
                    </Button>
                </Dropdown>
                <Button onClick={controller.handleOpen} type="primary">
                    {' '}
                    Create{' '}
                </Button>
            </div>
            {modal}
        </Fragment>
    );
};
