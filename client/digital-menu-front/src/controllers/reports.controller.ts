import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useToken } from '../hooks/useToken';
import { GetReportOuputDto, ReportService } from '../services/report.service';

export interface SelectOption {
    label: string;
    value: string;
}
export const useReports = () => {
    const [report, setReport] = useState<GetReportOuputDto>();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFilter, setIsLoadingFilter] = useState(false);
    const [select, setSelect] = useState<SelectOption>({ label: 'All', value: 'All' });
    const [isSelectTouched, setIsSelectTouched] = useState(false);
    const [rangeValue, setRangeValue] = useState<any>();
    const [visible, setVisible] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const reportService = new ReportService();
    const tokenController = useToken();

    const getReport = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        reportService
            .get(token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                setReport(res.data);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const getReportByFilter = (startAndEnd: [string, string]) => {
        const token = tokenController.execute();
        if (!token) return;
        const start: string = startAndEnd[0];
        const end: string = startAndEnd[1];
        setIsLoadingFilter(true);
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        reportService
            .getByRangeDate(start, end, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                setIsLoadingFilter(false);
                setReport(res.data);
                setVisible(false);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                setIsLoadingFilter(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const selectOptions: SelectOption[] = [
        { label: 'All', value: 'All' },
        { label: 'Today', value: 'Today' },
        { label: 'Yesterday', value: 'Yesterday' },
        { label: 'This Week', value: 'This Week' },
        { label: 'Last Week', value: 'Last Week' },
        { label: 'This Month', value: 'This Month' },
        { label: 'Last Month', value: 'Last Month' },
        { label: 'Last 7 Days', value: 'Last 7 Days' },
        { label: 'Last 3 Months', value: 'Last 3 Months' },
        { label: 'Custom', value: 'Custom' },
    ];

    useEffect(() => {
        getReport();
    }, []);

    const getTodayRange = (): [string, string] => {
        const startOfDay = moment().startOf('day').toISOString();
        const endOfDay = moment().endOf('day').toISOString();
        return [startOfDay, endOfDay];
    };

    const getYesterdayRange = (): [string, string] => {
        const startOfDay = moment().subtract(1, 'day').startOf('day').toISOString();
        const endOfDay = moment().toISOString();
        return [startOfDay, endOfDay];
    };

    const getThisWeekRange = (): [string, string] => {
        const startOfDay = moment().startOf('isoWeek').toISOString();
        const endOfDay = moment().endOf('isoWeek').toISOString();
        return [startOfDay, endOfDay];
    };

    const getLastWeekRange = (): [string, string] => {
        const startOfDay = moment().subtract(1, 'weeks').startOf('isoWeek').toISOString();
        const endOfDay = moment().endOf('isoWeek').toISOString();
        return [startOfDay, endOfDay];
    };

    const getThisMonthRange = (): [string, string] => {
        const startOfDay = moment().startOf('months').toISOString();
        const endOfDay = moment().endOf('months').toISOString();
        return [startOfDay, endOfDay];
    };

    const getLastMonthRange = (): [string, string] => {
        const startOfDay = moment().subtract(1, 'months').startOf('month').toISOString();
        const endOfDay = moment().subtract(1, 'months').endOf('month').toISOString();
        return [startOfDay, endOfDay];
    };

    const getLastSevenDaysRange = (): [string, string] => {
        const startOfDay = moment().subtract(7, 'days').toISOString();
        const endOfDay = moment().toISOString();
        return [startOfDay, endOfDay];
    };

    const getLastThreeMonths = (): [string, string] => {
        const startOfDay = moment().subtract(3, 'months').toISOString();
        const endOfDay = moment().toISOString();
        return [startOfDay, endOfDay];
    };

    useEffect(() => {
        if (select.value === 'Custom') {
            setVisible(true);
        } else if (isSelectTouched) {
            setVisible(false);
            switch (select.value) {
                case 'All':
                    getReport();
                    break;

                case 'Today':
                    getReportByFilter(getTodayRange());
                    break;

                case 'Yesterday':
                    getReportByFilter(getYesterdayRange());
                    break;

                case 'This Week':
                    getReportByFilter(getThisWeekRange());
                    break;

                case 'Last Week':
                    getReportByFilter(getLastWeekRange());
                    break;

                case 'This Month':
                    getReportByFilter(getThisMonthRange());
                    break;

                case 'Last Month':
                    getReportByFilter(getLastMonthRange());
                    break;

                case 'Last 7 Days':
                    getReportByFilter(getLastSevenDaysRange());
                    break;

                case 'Last 3 Months':
                    getReportByFilter(getLastThreeMonths());
                    break;
            }
        }
    }, [select]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        report,
        isLoading,
        select,
        setSelect,
        selectOptions,
        setRangeValue,
        setIsSelectTouched,
        isLoadingFilter,
        rangeValue,
        getReportByFilter,
        setVisible,
        visible,
    };
};
