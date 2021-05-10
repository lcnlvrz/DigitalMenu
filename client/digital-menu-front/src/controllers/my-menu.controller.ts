import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { MenuService } from '../services/menu.service';
import { Dispatch } from 'redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { MenuInterface, RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { IPaginationLinks, IPaginationMeta } from '../services/order.service';

export enum ActionStatusMenuAndPlate {
    PUBLISH = 'PUBLISH',
    HIDE = 'HIDE',
}

export enum StatusMenuAndPlate {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
}

export interface PaginationData {
    meta: IPaginationMeta;
    links?: IPaginationLinks;
}

export interface MenuStatusFilter {
    value: StatusMenuAndPlate | string;
    touched: boolean;
}

export const useMyMenu = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChangePlate, setIsLoadingChangePlate] = useState(false);
    const [query, setQuery] = useState({ value: '', touched: false });
    const [pagination, setPagination] = useState<PaginationData>();
    const [currentPage, setCurrentPage] = useState({ value: 1, touched: false });
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const [queryPlate, setQueryPlate] = useState({ value: '', touched: false, menuId: 0 });
    const [menuStatusFilter, setMenuStatusFilter] = useState<MenuStatusFilter>({ touched: false, value: '' });
    const [plateStatusFilter, setPlateStatusFilter] = useState<MenuStatusFilter & { menuId: number }>({
        touched: false,
        value: '',
        menuId: 0,
    });

    const menuService = new MenuService();

    const tokenController = useToken();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const restaurant = useSelector((state: RootState) => state.restaurant);

    const restaurantCopy = { ...restaurant };

    const handleSelect = (value: number[]) => {
        setSelected(value);
    };

    const changePlateStatus = (action: ActionStatusMenuAndPlate, menuId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoadingChangePlate(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .updatePlate(
                {
                    platesIds: selected,
                    status:
                        action === ActionStatusMenuAndPlate.HIDE
                            ? StatusMenuAndPlate.HIDDEN
                            : StatusMenuAndPlate.PUBLIC,
                },
                token,
                cancelToken.token,
            )
            .then((_) => {
                getPlatesBySearch(menuId, queryPlate.value, 'Plates updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingChangePlate(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const removePlate = (menuId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoadingChangePlate(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .removePlate(selected, token, cancelToken.token)
            .then((_) => {
                getPlatesBySearch(menuId, queryPlate.value, 'Plate deleted successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingChangePlate(false);
                message.error(err.response?.data?.detail || 'Error ');
            });
    };

    const updateMenuInformation = (menuId: number, input: Partial<MenuInterface>) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .updateMenu({ ...input, menusIds: [menuId] }, token, cancelToken.token)
            .then((_) => {
                getMenusBySearch('Updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const getMenusBySearch = async (specialSuccessMessage?: string) => {
        const token = tokenController.execute();
        if (!token) return;
        const queryLink =
            '?limit=5&page=' + currentPage.value + '&search=' + query.value + '&status=' + menuStatusFilter.value;
        setIsLoading(true);
        try {
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            const menus = await menuService.getManyWithPagination(queryLink, token, cancelToken.token);
            setPagination({ links: menus.data.links, meta: menus.data.meta });
            setIsLoading(false);
            dispatch({ type: RestaurantActionsTypes.SET_MENUS, payload: menus.data.items });
            if (specialSuccessMessage) {
                message.success(specialSuccessMessage);
            }
            setSelectedMenus([]);
            setSelected([]);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const getPlatesBySearch = (menuId: number, title: string, customSuccessMessage?: string) => {
        const token = tokenController.execute();
        if (!token) return;
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        setIsLoadingChangePlate(true);
        menuService
            .getPlatesByQuery(menuId, title, plateStatusFilter.value, token, cancelToken.token)
            .then((res) => {
                setIsLoadingChangePlate(false);
                dispatch({
                    type: RestaurantActionsTypes.SET_PLATES_BY_SEACH,
                    payload: { menuId, platesToSet: res.data },
                });
                if (customSuccessMessage) {
                    message.success(customSuccessMessage);
                }
                setSelected([]);
            })
            .catch((err: AxiosError) => {
                setIsLoadingChangePlate(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const duplicateMenu = (menuId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .duplicateMenu(menuId, token, cancelToken.token)
            .then((res) => {
                getMenusBySearch('Menu duplicated succesfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        if (query.touched) {
            const timeout = setTimeout(() => {
                getMenusBySearch();
            }, 500);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [query]);

    useEffect(() => {
        if (currentPage.touched) {
            getMenusBySearch();
        }
    }, [currentPage]);

    useEffect(() => {
        if (!restaurant.isLoading) {
            getMenusBySearch();
        }
    }, [restaurant.isLoading]);

    useEffect(() => {
        if (queryPlate.touched) {
            const timeout = setTimeout(() => {
                getPlatesBySearch(queryPlate.menuId, queryPlate.value);
            }, 500);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [queryPlate]);

    useEffect(() => {
        if (menuStatusFilter.touched) {
            getMenusBySearch();
        }
    }, [menuStatusFilter]);

    useEffect(() => {
        if (plateStatusFilter.touched) {
            getPlatesBySearch(plateStatusFilter.menuId, queryPlate.value);
        }
    }, [plateStatusFilter]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        selected,
        selectedMenus,
        isLoading,
        pagination,
        currentPage,
        queryPlate,
        query,
        restaurantCopy,
        isLoadingChangePlate,
        handleSelect,
        changePlateStatus,
        setQueryPlate,
        setPlateStatusFilter,
        setCurrentPage,
        getMenusBySearch,
        duplicateMenu,
        setMenuStatusFilter,
        setSelectedMenus,
        setQuery,
        removePlate,
        updateMenuInformation,
    };
};
