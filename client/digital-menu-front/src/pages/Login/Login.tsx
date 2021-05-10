import React from 'react';
import { Logo } from '../../components/Logo/Logo';
import { Button, Spin } from 'antd';
import { Form, Input, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { LoginSchema } from '../../schema/Login/login.schema';
import { LoginInitialValue } from '../../initial-values/Login/login.initial-value';
import { useLogin } from '../../controllers/login.controller';

export const Login = (): JSX.Element => {
    const Controller = useLogin();

    if (Controller.user.isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    return (
        <section className="w-full flex flex-row">
            <aside className="w-2/4 h-screen relative bg-black 500:hidden">
                <div className="absolute h-full z-30 flex flex-col items-center justify-evenly w-full p-3">
                    <div className="flex flex-col space-y-3">
                        <Link to="/">
                            <Logo logoClassName="text-white text-6xl" textClassName="text-white text-2xl" />
                        </Link>
                        <p className="text-white text-center justify-center font-light text-lg">
                            {' '}
                            Welcome back. Ready to sell and manage your orders? 😎{' '}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-white font-semibold text-2xl text-center">New here?</span>
                        <Link to="/auth/register" className="w-full text-center">
                            <Button className="w-full" type="default" ghost>
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
                <img
                    className="h-full object-cover opacity-40"
                    src="https://image.freepik.com/free-photo/luxury-tableware-beautiful-table-setting-restaurant_73492-239.jpg"
                />
            </aside>
            <main className="w-2/4 h-screen flex items-center justify-center flex-col 500:w-full">
                <div className="fixed top-3 hidden 500:block">
                    <Link to="/">
                        <Logo textClassName="text-black font-semibold" logoClassName="text-black text-4xl" />
                    </Link>
                </div>
                <div className="w-3/4">
                    <h1 className="text-3xl"> Sign in. </h1>
                </div>
                <br />
                <Formik
                    onSubmit={(values) => Controller.login(values)}
                    validationSchema={LoginSchema}
                    initialValues={LoginInitialValue}
                >
                    <Form layout="vertical" className="w-3/4">
                        <Form.Item required label="Email:" name="email">
                            <Input name="email" />
                        </Form.Item>
                        <Form.Item required label="Password:" name="password">
                            <Input.Password name="password" />
                        </Form.Item>
                        <SubmitButton loading={Controller.isLoading} className="w-full">
                            Login
                        </SubmitButton>
                        <div className="w-full flex flex-col space-y-2 mt-5">
                            <div className="hidden 500:block w-full text-center">
                                <p className="m-0">
                                    Not have an account yet?{' '}
                                    <Link to="/auth/register">
                                        <span className="text-blue-500 hover:underline cursor-pointer">Register</span>
                                    </Link>
                                </p>
                            </div>
                            <div className="w-full flex flex-row justify-center space-x-1 text-center m-0">
                                <p className="m-0">Forgot your password?</p>
                                <Link to="/auth/send-mail-password">
                                    <span className="text-blue-500 hover:underline cursor-pointer">Reset</span>
                                </Link>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </main>
        </section>
    );
};
