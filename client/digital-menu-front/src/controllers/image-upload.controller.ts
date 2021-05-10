import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUploadProps } from '../components/ImageUpload/ImageUpload';

export const useImageUpload = (params: ImageUploadProps) => {
    const [previewImage, setPreviewImage] = useState('');
    const [dragHover, setDragHover] = useState(false);
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: 'image/*',
        onDragEnter: (e) => {
            setDragHover(true);
        },
        onDragLeave: (e) => {
            setDragHover(false);
        },
        onDropAccepted: (files) => {
            setDragHover(false);
            URL.revokeObjectURL(previewImage);
            params.setFieldTouched(params.fieldName, true);
            params.setFieldError(params.fieldName, '');
            params.setFieldValue(params.fieldName, files[0]);
            setPreviewImage(URL.createObjectURL(files[0]));
        },
        onDropRejected: () => {
            setDragHover(false);
            params.setFieldTouched(params.fieldName, true);
            params.setFieldError(params.fieldName, 'Image too heavy. Try with another less size');
        },
        maxFiles: 1,
        maxSize: 2097152,
        multiple: false,
    });

    const removeImage = () => {
        setPreviewImage('');
        params.setFieldValue(params.fieldName, '');
    };

    useEffect(() => {
        if (params.initialImage) {
            setPreviewImage(params.initialImage);
        }
    }, []);

    useEffect(() => {
        if (!params.values[params.fieldName]) {
            setPreviewImage('');
        }
    }, [params.values[params.fieldName]]);

    return { getRootProps, getInputProps, previewImage, open, removeImage, dragHover };
};
