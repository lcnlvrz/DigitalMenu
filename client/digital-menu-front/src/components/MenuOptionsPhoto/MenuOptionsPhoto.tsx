import React from 'react';
import { Menu } from 'antd';

export interface MenuOptionsPhotoProps {
    handleUpdate: () => void;
    handleDelete: () => void;
    executeInRender?: () => void;
}

export const MenuOptionsPhoto = (props: MenuOptionsPhotoProps) => {
    return (
        <Menu onClick={props?.executeInRender}>
            <Menu.Item onClick={props.handleUpdate} key="1">
                {' '}
                Update{' '}
            </Menu.Item>
            <Menu.Item onClick={props.handleDelete} key="2" danger>
                {' '}
                Delete{' '}
            </Menu.Item>
        </Menu>
    );
};
