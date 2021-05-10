import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useToken } from '../hooks/useToken';
import { SurveyFormService } from '../services/survey-form.service';
import { Dispatch } from 'redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { useEffect, useState } from 'react';
import { message, TablePaginationConfig } from 'antd';
import { IPaginationLinks, IPaginationMeta, SurveyFormResponse } from '../services/order.service';

export enum SurveyFormResponseFilter {
    ALL = 'ALL',
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
}

export const useResponsesSurveyForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [indexFormOpen, setIndexFormOpen] = useState(0);
    const [visible, setVisible] = useState(false);
    const [surveyFormsResponses, setSurveyFormsResponses] = useState<SurveyFormResponse[]>();
    const [filterSelected, setFilterSelected] = useState<SurveyFormResponseFilter>(SurveyFormResponseFilter.ALL);
    const [queryInput, setQueryInput] = useState('');
    const [queryRangeDate, setQueryRangeDate] = useState<[string, string]>(['', '']);
    const [pagination, setPagination] = useState<TablePaginationConfig>();
    const [touched, setTouched] = useState(false);
    const [sort, setSort] = useState({ field: '', order: '', touched: false });
    const [currentPage, setCurrentPage] = useState({ value: 1, touched: false });
    const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta>();
    const [paginationLinks, setPaginationLinks] = useState<IPaginationLinks>();
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();
    const restaurant = useSelector((state: RootState) => state.restaurant);

    const surveyFormService = new SurveyFormService();

    const form = surveyFormsResponses?.[indexFormOpen];

    const columnsData = surveyFormsResponses?.map((response, index) => ({
        key: index,
        date: response.createdAt,
        status: response.status,
        form: response?.surveyForm?.name,
        table: response.order?.tableName,
        createdAt: response.createdAt,
        actions: index,
    }));

    const fetchSurveyFormResponses = (specialSuccessMessage?: string) => {
        const token = tokenController.execute();
        if (!token) return;
        const baseQuery = '?limit=5&page=' + currentPage.value;
        const tableOrForm = '&tableOrForm=' + queryInput;
        const rangeDate =
            queryRangeDate[0] && queryRangeDate[1]
                ? '&rangeDate=true&start=' + queryRangeDate[0] + '&end=' + queryRangeDate[1]
                : '';
        const sortQuery = sort.field && sort.order ? '&order=' + sort.order + '&field=' + sort.field : '';
        const status = filterSelected !== SurveyFormResponseFilter.ALL ? '&status=' + filterSelected : '';
        const queryFormed = baseQuery + tableOrForm + rangeDate + status + sortQuery;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .getManySurveyFormResponses(token, cancelToken.token, queryFormed)
            .then((res) => {
                setIsLoading(false);
                setPaginationMeta(res.data.meta);
                setPaginationLinks(res.data.links);
                dispatch({ type: RestaurantActionsTypes.SET_SURVEY_FORMS_RESPONSES, payload: res.data.items });
                if (specialSuccessMessage) {
                    message.success(specialSuccessMessage);
                }
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const onViewFormResponse = (index: number) => {
        setVisible(true);
        setIndexFormOpen(index);
    };

    const onCloseFormResponse = () => {
        setVisible(false);
        setIndexFormOpen(0);
    };

    const onChangeStatus = (index: number) => {
        const surveyFormResponseId = restaurant.surveyFormsResponses?.[index]?.id;
        if (surveyFormResponseId) {
            const token = tokenController.execute();
            if (!token) return;
            setIsLoading(true);
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            surveyFormService
                .updateSurveyFormResponseStatus(surveyFormResponseId, token, cancelToken.token)
                .then((res) => {
                    fetchSurveyFormResponses('Feedback status updated successfully!');
                })
                .catch((err: AxiosError) => {
                    if (axios.isCancel(err)) return;
                    setIsLoading(false);
                    message.error(err.response?.data?.detail || 'Unexpected error happened!');
                });
        }
    };

    const clearFilter = () => {
        setSurveyFormsResponses(restaurant.surveyFormsResponses);
    };

    useEffect(() => {
        if (!restaurant.isLoading) {
            fetchSurveyFormResponses();
        }
    }, [restaurant.isLoading]);

    const filterData = () => {
        switch (filterSelected) {
            case SurveyFormResponseFilter.CLOSED:
                const closedResponses = restaurant.surveyFormsResponses?.filter((res) => res.status === 'CLOSED');
                setSurveyFormsResponses(closedResponses);
                break;

            case SurveyFormResponseFilter.OPEN:
                const openResponses = restaurant.surveyFormsResponses?.filter((res) => res.status === 'OPEN');
                setSurveyFormsResponses(openResponses);
                break;

            default:
                setSurveyFormsResponses(restaurant.surveyFormsResponses);
        }
    };

    useEffect(() => {
        if (!restaurant.isLoading) {
            filterData();
        }
    }, [restaurant]);

    useEffect(() => {
        if (touched) {
            fetchSurveyFormResponses();
        }
    }, [queryInput, queryRangeDate, filterSelected, pagination, sort]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        isLoading,
        restaurant,
        columnsData,
        filterSelected,
        form,
        visible,
        queryInput,
        touched,
        indexFormOpen,
        currentPage,
        paginationMeta,
        sort,
        setIndexFormOpen,
        setTouched,
        setPagination,
        onViewFormResponse,
        onCloseFormResponse,
        setSort,
        onChangeStatus,
        fetchSurveyFormResponses,
        clearFilter,
        setCurrentPage,
        setQueryInput,
        setFilterSelected,
        setQueryRangeDate,
    };
};
