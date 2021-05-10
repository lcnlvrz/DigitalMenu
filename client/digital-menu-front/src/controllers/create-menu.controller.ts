import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { CreateMenuProps } from '../components/CreateMenu/CreateMenu';
import { useToken } from '../hooks/useToken';
import { CreateMenu, RestaurantActionsTypes, StatusMenuAndPlate } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { MenuService } from '../services/menu.service';
import { ActionStatusMenuAndPlate } from './my-menu.controller';

export const useCreateMenu = (params: CreateMenuProps) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const handleOpen = () => {
        if (isOpenModal) {
            setIsOpenModal(false);
        } else {
            setIsOpenModal(true);
        }
    };

    const tokenController = useToken();

    const menuService = new MenuService();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const createMenu = (input: CreateMenu) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .create(input, token, cancelToken.token)
            .then(async (_) => {
                await params.getMenusBySearch();
                setIsLoading(false);
                message.success('Menu created successfully!');
                handleOpen();
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const updateMenu = async (action: ActionStatusMenuAndPlate, menusIds: number[]) => {
        const token = tokenController.execute();
        if (!token) return;
        const newStatus =
            action === ActionStatusMenuAndPlate.PUBLISH ? StatusMenuAndPlate.PUBLIC : StatusMenuAndPlate.HIDDEN;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .updateMenu({ menusIds, status: newStatus }, token, cancelToken.token)
            .then(async (_) => {
                await params.getMenusBySearch();
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.UPDATE_STATUS_MENU, payload: { menusIds, status: newStatus } });
                message.success('Menu Updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const removeMenu = (menusIds: number[]) => {
        const token = tokenController.execute();
        if (!token) return;
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .removeMenu(menusIds, token, cancelToken.token)
            .then(async (_) => {
                await params.getMenusBySearch();
                setIsLoading(true);
                message.success('Menu deleted successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { isOpenModal, handleOpen, isLoading, createMenu, updateMenu, removeMenu };
};
