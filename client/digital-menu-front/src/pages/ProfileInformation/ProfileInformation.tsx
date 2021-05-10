import React from 'react';
import { Input, Form, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import { useProfileInformation } from '../../controllers/profile-information.controller';
import { ProfileInformationSchema } from '../../schema/ProfileInformation/ProfileInformation';
import { useMediaQuery } from 'react-responsive';

const ProfileInformation = () => {
    const controller = useProfileInformation();

    const isMobile = useMediaQuery({ maxWidth: '450px' });

    return (
        <section className="w-full flex flex-col items-center">
            <div
                className="flex flex-col text-center justify-center items-start space-y-6 450:space-y-0 450:p-5"
                style={{
                    width: 'fit-content',
                    height: !isMobile ? '80vh' : '',
                }}
            >
                <div className="text-center w-full">
                    <h2 className="text-3xl text-gray-800 m-0 500:text-2xl 500:mb-3 font-bold">
                        {' '}
                        PROFILE INFORMATION{' '}
                    </h2>
                </div>
                <Formik
                    onSubmit={(values) =>
                        controller.updateUser({ firstName: values.firstName, lastName: values.lastName })
                    }
                    validationSchema={ProfileInformationSchema}
                    initialValues={{
                        firstName: controller.user.firstName || '',
                        lastName: controller.user.lastName || '',
                        email: controller.user.email || '',
                    }}
                >
                    <Form layout="vertical">
                        <Form.Item style={{ marginBottom: !isMobile ? '10px' : 0 }} name="completeName">
                            <Form.Item
                                style={{
                                    width: isMobile ? '100%' : '',
                                    margin: 0,
                                    textAlign: 'left',
                                }}
                                name="firstName"
                                required
                                label="First Name:"
                            >
                                <Input name="firstName" />
                            </Form.Item>
                            <Form.Item
                                style={{
                                    width: isMobile ? '100%' : '',
                                    margin: isMobile ? 0 : '',
                                    marginBottom: isMobile ? '15px' : 0,
                                    textAlign: 'left',
                                }}
                                name="lastName"
                                required
                                label="Last Name:"
                            >
                                <Input name="lastName" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item name="email" className="m-0" required label="Email:">
                            <Input name="email" readOnly />
                        </Form.Item>
                        <div className="w-full flex items-center my-5 justify-center">
                            <SubmitButton loading={controller.isLoading} type="primary">
                                {' '}
                                Update{' '}
                            </SubmitButton>
                        </div>
                    </Form>
                </Formik>
            </div>
        </section>
    );
};

export default ProfileInformation;
