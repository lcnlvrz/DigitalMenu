import React from 'react';
import { Divider, Modal } from 'antd';
import { useModalEditProfilePhoto } from '../../controllers/modal-edit-profile-photo.controller';
import { Upload, Button } from 'antd';
import { BsCardImage } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/root-state.reducer';

export interface ModalEditProfilePhotoProps {
    isChangeProfilePhoto: boolean;
    handleProfilePhoto: () => void;
}

export const ModalEditProfilePhoto = (props: ModalEditProfilePhotoProps): JSX.Element => {
    const controller = useModalEditProfilePhoto();

    const restaurant = useSelector((state: RootState) => state.restaurant);

    const options = (
        <div className="flex flex-col space-y-5 items-center justify-center">
            <span
                onClick={() => controller.handleUpdateProfilePhoto()}
                className="font-semibold cursor-pointer text-gray-500 hover:text-black transition-all"
            >
                {' '}
                Update Profile Photo{' '}
            </span>
            <Divider />
            <span
                onClick={() => controller.deletePhoto({ profilePhoto: undefined })}
                className="text-red-400 hover:text-red-500 font-semibold opacity-80 cursor-pointer transition-all"
            >
                {' '}
                Delete Profile Photo{' '}
            </span>
        </div>
    );

    const updateProfilePhoto = (
        <>
            <Upload.Dragger>
                <BsCardImage className="text-8xl inline-block" />
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    You only can upload one photo. Forbidden photos that it&apos;s not about restaurant profile.
                </p>
            </Upload.Dragger>
            <br />
            <Button className="w-full">Update</Button>
        </>
    );

    return (
        <Modal
            onCancel={() => props.handleProfilePhoto()}
            onOk={() => props.handleProfilePhoto()}
            title={null}
            footer={null}
            visible={props.isChangeProfilePhoto}
        >
            {controller.isUpdatingProfilePhoto ? updateProfilePhoto : options}
        </Modal>
    );
};
