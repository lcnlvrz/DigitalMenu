import React from 'react';
import { Logo } from '../../components/Logo/Logo';
import { RegisterInitialValue } from '../../initial-values/Register';
import { RegisterSchema } from '../../schema/Register';
import { Button, Spin } from 'antd';
import { Form, Input, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { useRegister } from '../../controllers/register.controller';
import { UserRoles } from '../../interfaces/User';

export const Register = (): JSX.Element => {
    const controller = useRegister();

    if (controller.user.isLoading) {
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
                            The unique free CRM for restaurants in the world.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-white font-semibold text-2xl text-center">Known around here?</span>
                        <Link to="/auth/login" className="w-full text-center">
                            <Button className="w-full" type="default" ghost>
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
                <img
                    className="h-full object-cover opacity-40"
                    src="https://image.freepik.com/free-photo/restaurant-interior_1127-3394.jpg"
                />
            </aside>
            <main className="w-2/4 h-screen  flex items-center justify-center flex-col 500:w-full">
                <div className="sticky top-3 hidden 500:block">
                    <Link to="/">
                        <Logo textClassName="text-black font-semibold" logoClassName="text-black text-4xl" />
                    </Link>
                </div>
                <div className="w-3/4 500:hidden">
                    <h1 className="text-3xl"> Sign Up. </h1>
                </div>
                <br />
                <Formik
                    onSubmit={(values) => controller.register({ ...values, role: [UserRoles.OWNER] })}
                    validationSchema={RegisterSchema}
                    initialValues={RegisterInitialValue}
                >
                    <Form layout="vertical" className="w-3/4">
                        <Form.Item required label="First Name:" name="firstName">
                            <Input name="firstName" />
                        </Form.Item>
                        <Form.Item required label="Last Name:" name="lastName">
                            <Input name="lastName" />
                        </Form.Item>
                        <Form.Item required label="Email:" name="email">
                            <Input name="email" />
                        </Form.Item>
                        <Form.Item required label="Password:" name="password">
                            <Input.Password name="password" />
                        </Form.Item>
                        <SubmitButton loading={controller.isLoading} className="w-full">
                            Register
                        </SubmitButton>
                        <div className="hidden 500:block w-full text-center my-2">
                            <p>
                                Already have an account?{' '}
                                <Link to="/auth/login">
                                    <span className="text-blue-500 hover:underline cursor-pointer">Login</span>
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Formik>
            </main>
        </section>
    );
};
