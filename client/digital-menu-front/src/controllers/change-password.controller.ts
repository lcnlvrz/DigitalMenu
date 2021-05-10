import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { UserService } from '../services/user.service';

export const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const userService = new UserService();

    const token = new URL(window.location.href).searchParams.get('token');

    const changePassword = (newPassword: string) => {
        if (!token) {
            return message.error('Token expired or invalid');
        } else {
            setIsLoading(true);
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            userService
                .resetPassword(newPassword, token, cancelToken.token)
                .then((res) => {
                    setIsLoading(false);
                    setIsPasswordChanged(true);
                })
                .catch((err: AxiosError) => {
                    if (axios.isCancel(err)) return;
                    setIsLoading(false);
                    message.error(err.response?.data?.detail || 'Unexpected error happened!');
                });
        }
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { isLoading, changePassword, isPasswordChanged };
};
