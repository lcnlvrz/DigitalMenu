import { Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, SubmitButton } from 'formik-antd';
import { SiMinutemailer } from 'react-icons/si';
import { Logo } from '../../../components/Logo/Logo';
import { SendMailPasswordSchema } from '../../../schema/ResetPassword/reset-password.schema';
import { useSendMailPassword } from '../../../controllers/send-mail-password.controller';
import { useMediaQuery } from 'react-responsive';

const SendMailPassword = () => {
    const controller = useSendMailPassword();

    const isMax450 = useMediaQuery({ maxWidth: '450px' });

    if (controller.isMailSent) {
        return (
            <div className="h-screen flex p-5 items-center flex-col justify-center">
                <SiMinutemailer className="text-9xl text-black" />
                <div className="flex flex-col">
                    <h2 className="text-4xl m-0 text-center">Mail was sent successfully</h2>
                    <p className="font-light m-0 text-lg text-center">
                        Go to your mail box and click in the link received
                    </p>
                </div>
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
                <h1 className="text-3xl"> Reset Password. </h1>
                <div style={{ width: isMax450 ? '100%' : '400px', textAlign: 'left' }}>
                    <p>
                        For change your password, type your email bellow and you&apos;ll receive a mail with the link
                        for reset the password.{' '}
                    </p>
                </div>
            </div>
            <Formik
                onSubmit={(v) => controller.sendMailResetPassword(v.email)}
                validationSchema={SendMailPasswordSchema}
                initialValues={{ email: '' }}
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
                    <Form.Item style={{ width: isMax450 ? '100%' : '400px' }} label="Email:" required name="email">
                        <Input style={{ width: '100%' }} name="email" />
                    </Form.Item>
                    <div style={{ width: isMax450 ? '100%' : '400px', textAlign: 'left' }}>
                        <SubmitButton loading={controller.isLoading}>Send Mail</SubmitButton>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default SendMailPassword;
