import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useToken } from '../hooks/useToken';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { UserService, UpdateUserInput } from '../services/user.service';

export const useProfileInformation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const user = useSelector((state: RootState) => state.user);
    const tokenController = useToken();

    const userService = new UserService();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const updateUser = (input: UpdateUserInput) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        userService
            .updateUser(input, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: UserActionsTypes.UPDATE_USER, payload: res.data });
                message.success('Profile Information updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened');
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { user, updateUser, isLoading };
};
