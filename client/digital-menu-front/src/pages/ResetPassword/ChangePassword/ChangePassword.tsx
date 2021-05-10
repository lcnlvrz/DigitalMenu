import React from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo/Logo';
import { ChangePasswordSchema } from '../../../schema/ResetPassword/reset-password.schema';
import { Form, Input, SubmitButton } from 'formik-antd';
import { useChangePassword } from '../../../controllers/change-password.controller';
import { AiOutlineUnlock } from 'react-icons/ai';
import { Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

const ChangePassword = () => {
    const controller = useChangePassword();

    const isMax450 = useMediaQuery({ maxWidth: '450px' });

    if (controller.isPasswordChanged) {
        return (
            <div className="h-screen w-full items-center justify-center flex flex-col">
                <AiOutlineUnlock className="text-green-500 text-9xl" />
                <h2 className="text-2xl">Password Changed Successfully</h2>
                <Link to="/auth/login">
                    <Button type="primary">Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen flex-col flex items-center justify-center 450:p-5">
            <div className="fixed top-3">
                <Link to="/">
                    <Logo textClassName="text-black font-semibold" logoClassName="text-black text-4xl" />
                </Link>
            </div>
            <div className="text-left">
                <h1 className="text-3xl"> Change Password </h1>
                <div style={{ width: isMax450 ? '100%' : '400px', textAlign: 'left' }}>
                    <p>Please, fill out the following information for change the password.</p>
                </div>
            </div>
            <Formik
                onSubmit={(v) => {
                    controller.changePassword(v.newPassword);
                }}
                validationSchema={ChangePasswordSchema}
                initialValues={{ newPassword: '', repeatNewPassword: '' }}
            >
                <Form
                    style={{
                        width: isMax450 ? '100%' : '75%',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                    layout="vertical"
                >
                    <Form.Item
                        style={{ width: isMax450 ? '100%' : '400px' }}
                        label="New Password:"
                        required
                        name="newPassword"
                    >
                        <Input.Password style={{ width: '100%' }} name="newPassword" />
                    </Form.Item>
                    <Form.Item
                        style={{ width: isMax450 ? '100%' : '400px' }}
                        label="Repeat Password:"
                        required
                        name="repeatNewPassword"
                    >
                        <Input.Password style={{ width: '100%' }} name="repeatNewPassword" />
                    </Form.Item>
                    <div style={{ width: isMax450 ? '100%' : '400px', textAlign: 'left' }}>
                        <SubmitButton loading={controller.isLoading}>Reset Password</SubmitButton>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default ChangePassword;
