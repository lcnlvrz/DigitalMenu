import React from 'react';
import { Modal } from 'antd';
import { GoAlert } from 'react-icons/go';

export interface ModalConfirmProps {
    okHandle: () => void;
    cancelHandle: () => void;
    visible: boolean;
    isLoading: boolean;
}

export const ModalConfirm = (props: ModalConfirmProps) => {
    return (
        <Modal
            closable={false}
            destroyOnClose
            confirmLoading={props.isLoading}
            visible={props.visible}
            okText="Yes"
            cancelText="Cancel"
            onOk={props.okHandle}
            onCancel={props.cancelHandle}
        >
            <div className="w-full flex flex-row items-center space-x-4">
                <GoAlert className="text-3xl text-yellow-500" />
                <h1 className="text-lg"> Are you sure to make this decision? </h1>
            </div>
        </Modal>
    );
};
