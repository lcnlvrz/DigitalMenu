import React from 'react';
import { Button } from 'antd';
import { MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';

const NotFoundContent = () => {
    return (
        <div className="h-screen items-center space-y-5 flex flex-col  justify-center">
            <MdError className="text-9xl" />
            <div className="flex flex-col text-center">
                <h2 className="text-2xl font-bold m-0">This page doesn&apos;t exist</h2>
                <p className="m-0 font-semibold"> Did you get lost? </p>
            </div>
            <Link to="/">
                <Button type="primary">GO HOME</Button>
            </Link>
        </div>
    );
};

export default NotFoundContent;
