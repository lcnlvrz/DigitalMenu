import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';

export const useSendMailPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMailSent, setIsMailSent] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const authService = new AuthService();

    const sendMailResetPassword = (email: string) => {
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        authService
            .sendMailResetPassword(email, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                setIsMailSent(true);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { isLoading, sendMailResetPassword, isMailSent };
};
