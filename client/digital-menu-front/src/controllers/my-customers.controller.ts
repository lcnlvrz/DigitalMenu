import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import {
    IPaginationLinks,
    IPaginationMeta,
    OrderService,
    OrderStatus,
    UpdateOrderInput,
} from '../services/order.service';
import { Dispatch } from 'redux';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { TableService } from '../services/table.service';

export type UpdateOrderInputMinimized = Omit<UpdateOrderInput, 'sortBy'>;

export interface OrdersFilters {
    orderNumber?: SortOrder;
    tableNumber?: SortOrder;
    total?: SortOrder;
    createdAt?: SortOrder;
}

export interface Filters {
    status?: OrderStatus;
    updateTime?: [string, string];
    table?: string;
    search?: string;
    touched: boolean;
}

export const useMyCustomers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta>();
    const [paginationLinks, setPaginationLinks] = useState<IPaginationLinks>();
    const [currentPage, setCurrentPage] = useState({ value: 1, touched: false });
    const [filters, setFilters] = useState<Filters>({ status: OrderStatus.ALL, touched: false });
    const [sort, setSort] = useState({ field: '', order: '', touched: false });
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const orderService = new OrderService();
    const tableService = new TableService();

    const tokenController = useToken();
    const customersOrders = useSelector((state: RootState) => state.restaurant.orders);
    const restaurant = useSelector((state: RootState) => state.restaurant);
    const dispatch: Dispatch<AllActions> = useDispatch();

    const updateOrder = (input: UpdateOrderInput, orderId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        orderService
            .updateOrderById(orderId, token, { ...input }, cancelToken.token)
            .then((res) => {
                fetchOrders();
                message.success('Order updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const fetchOrders = () => {
        const token = tokenController.execute();
        if (!token) return;
        const query = formLinkQuery();
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        orderService
            .getMany(token, cancelToken.token, query)
            .then((res) => {
                setPaginationMeta(res.data.meta);
                setPaginationLinks(res.data.links);
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_ORDERS, payload: res.data.items });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const fetchTables = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        tableService
            .getMany(token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_TABLES, payload: res.data });
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
            });
    };

    const formLinkQuery = (): string => {
        const baseQuery = '?page=' + currentPage.value + '&limit=5';
        const status = filters.status && filters.status !== 'ALL' ? '&status=' + filters.status : '';
        const updateTime = filters.updateTime
            ? '&rangeDate=true' + '&start=' + filters.updateTime[0] + '&end=' + filters.updateTime[1]
            : '';
        const search = filters.search ? '&search=' + filters.search : '';
        const table = filters.table ? '&table=' + filters.table : '';
        const sortable = sort.field ? '&field=' + sort.field + '&order=' + sort.order : '';
        return baseQuery + status + updateTime + search + table + sortable;
    };

    useEffect(() => {
        if (filters.touched) {
            const timeout = setTimeout(() => {
                fetchOrders();
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [filters]);

    useEffect(() => {
        if (!restaurant.isLoading) {
            fetchOrders();
            fetchTables();
        }
    }, [restaurant.isLoading]);

    useEffect(() => {
        if (sort.touched) {
            fetchOrders();
        }
    }, [sort]);

    useEffect(() => {
        if (currentPage.touched) {
            fetchOrders();
        }
    }, [currentPage]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        customersOrders,
        isLoading,
        paginationLinks,
        currentPage,
        paginationMeta,
        filters,
        restaurant,
        updateOrder,
        fetchOrders,
        setFilters,
        setSort,
        setCurrentPage,
    };
};
