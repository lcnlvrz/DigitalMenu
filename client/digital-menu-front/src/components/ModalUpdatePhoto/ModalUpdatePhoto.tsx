import React from 'react';
import { Button, Modal, Upload } from 'antd';
import { BsFillImageFill } from 'react-icons/bs';
import { Photo } from '../../controllers/my-restaurant.controller';
import { useModalUpdatePhoto } from '../../controllers/modal-update-photo.controller';
import Avatar from 'antd/lib/avatar/avatar';

export interface ModalUpdatePhotoProps {
    isOpen: boolean;
    handleOpen: () => void;
    bannerOrPhoto: Photo;
}

export const ModalUpdatePhoto = (props: ModalUpdatePhotoProps) => {
    const controller = useModalUpdatePhoto({ bannerOrProfile: props.bannerOrPhoto, handleOpen: props.handleOpen });

    const dragger = (
        <Upload.Dragger
            fileList={
                controller.previewImage.file
                    ? [
                          {
                              ...controller.previewImage.file,
                              originFileObj: controller.previewImage.file,
                              name: controller.previewImage.file.name,
                          },
                      ]
                    : undefined
            }
            onRemove={controller.onRemove}
            listType="picture"
            beforeUpload={(file) => controller.beforeUpload(file)}
            disabled={controller.isLoading}
            style={{ margin: '0px 0px', border: controller.previewImage.bobURL ? 'none' : '' }}
            multiple={false}
            maxCount={1}
        >
            {controller.previewImage.bobURL && controller.previewImage.file ? (
                <Avatar shape="square" style={{ width: '100%', height: '100%' }} src={controller.previewImage.bobURL} />
            ) : (
                <>
                    <BsFillImageFill className="text-6xl inline-block my-2" />
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other band
                        files
                    </p>
                </>
            )}
        </Upload.Dragger>
    );

    return (
        <Modal
            zIndex={10000}
            confirmLoading
            destroyOnClose
            onCancel={() => {
                if (controller.isLoading) return;
                controller.setPreviewImage({ bobURL: undefined, file: undefined });
                props.handleOpen();
            }}
            footer={null}
            visible={props.isOpen}
        >
            {dragger}
            {controller.previewImage.bobURL && (
                <Button
                    onClick={controller.updatePhoto}
                    loading={controller.isLoading}
                    type="primary"
                    className="w-full mt-5"
                >
                    {' '}
                    Save Photo{' '}
                </Button>
            )}
        </Modal>
    );
};
