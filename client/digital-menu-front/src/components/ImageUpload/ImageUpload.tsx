import { Button } from 'antd';
import React from 'react';

import { BsFillImageFill } from 'react-icons/bs';
import { useImageUpload } from '../../controllers/image-upload.controller';

export type SetFieldValue = (field: string, value: any, shouldValidate?: boolean | undefined) => void;
export type SetFieldTouched = (
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined,
) => void;
export type SetFieldError = (field: string, message: string | undefined) => void;

export interface ImageUploadProps {
    setFieldValue: SetFieldValue;
    setFieldTouched: SetFieldTouched;
    setFieldError: SetFieldError;
    values: any;
    initialImage?: string;
    errors: any;
    touched: any;
    fieldName: string;
}

const ImageUpload = (props: ImageUploadProps) => {
    const controller = useImageUpload(props);

    const error = props.errors[props.fieldName];
    const touched = props.touched[props.fieldName];

    if (controller.previewImage || props.initialImage) {
        return (
            <div className="w-64 h-44 flex flex-col space-y-3">
                <img className="w-full h-32 object-contain" src={controller.previewImage || props.initialImage} />
                <div className="flex flex-row items-center justify-center">
                    <Button className="font-semibold" size="small" type="default" {...controller.getRootProps()}>
                        <span className="font-semibold">Change</span>
                    </Button>
                    <Button onClick={controller.removeImage} size="small" type="default" className="">
                        <span className="font-semibold">Remove</span>
                    </Button>
                    <input {...controller.getInputProps()} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <section
                {...controller.getRootProps({ className: 'dropzone' })}
                className={`p-5 flex items-center rounded justify-center cursor-pointer w-64 h-44 border border-dashed ${((): string => {
                    if (controller.dragHover) {
                        return 'border-blue-500';
                    } else if (error && touched) {
                        return 'border-red-500';
                    } else {
                        return 'border-blue-300 hover:border-blue-600';
                    }
                })()} transition-all`}
            >
                <input className="w-full h-full" {...controller.getInputProps()} />
                <div className="w-full flex flex-col items-center text-center justify-center space-y-3">
                    <BsFillImageFill className="text-6xl" />
                    <div>
                        <p className="m-0 font-semibold">Drop a file here o click me!</p>
                        <p className="m-0 font-light">Image can be .jpg or .png and size no more than 2 MB</p>
                    </div>
                </div>
            </section>
            <p className="text-red-500 h-7">
                {props.errors[props.fieldName] && touched && props.errors[props.fieldName]}
            </p>
        </div>
    );
};

export default ImageUpload;
