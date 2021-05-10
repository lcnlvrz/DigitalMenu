import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { CreateTableInput, TableInterface, TableService } from '../services/table.service';
import { Dispatch } from 'redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';

export const useTables = () => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [currentTable, setCurrentTable] = useState<TableInterface>();
    const [visibleSecurityPasswords, setVisibleSecurityPasswords] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();
    const tableService = new TableService();
    const tables = useSelector((state: RootState) => state.restaurant.tables);
    const restaurant = useSelector((state: RootState) => state.restaurant);
    const user = useSelector((state: RootState) => state.user);

    const handleOpen = () => {
        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    const handleOpenEdit = () => {
        if (visibleEdit) {
            setVisibleEdit(false);
        } else {
            setVisibleEdit(true);
        }
    };

    const handleOpenSecurityPasswords = () => {
        if (visibleSecurityPasswords) {
            setVisibleSecurityPasswords(false);
        } else {
            setVisibleSecurityPasswords(true);
        }
    };

    const createTable = (input: CreateTableInput) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        tableService
            .create(input, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.ADD_TABLE, payload: res.data });
                handleOpen();
                message.success('Table created successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const getTables = () => {
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

    const updateTable = (input: Partial<CreateTableInput>) => {
        const token = tokenController.execute();
        if (!token || !currentTable?.id) return;
        if (!input.securityPassword) delete input.securityPassword;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        tableService
            .updateOne(input, token, currentTable.id, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.UPDATE_TABLE,
                    payload: { tableIdToUpdate: currentTable.id, newDataTable: res.data },
                });
                message.success('Table updated successfully!');
                setCurrentTable(undefined);
                handleOpenEdit();
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const removeTable = (tableId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        tableService
            .removeOne(token, tableId, cancelToken.token)
            .then((_) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.REMOVE_TABLE, payload: { tableIdToRemove: tableId } });
                message.success('Table was deleted successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const sendSecurityPasswords = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        tableService
            .sendMailSecurityPasswords(token, cancelToken.token)
            .then((_) => {
                setIsLoading(false);
                message.success('The mail was sent successfully. Check it out.');
                handleOpenSecurityPasswords();
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        if (!restaurant.isLoading) {
            getTables();
        }
    }, [restaurant.isLoading]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        handleOpen,
        visible,
        createTable,
        tables,
        isLoading,
        handleOpenEdit,
        sendSecurityPasswords,
        handleOpenSecurityPasswords,
        visibleEdit,
        user,
        visibleSecurityPasswords,
        removeTable,
        setCurrentTable,
        updateTable,
        currentTable,
    };
};
