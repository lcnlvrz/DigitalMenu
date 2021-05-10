import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useToken } from '../hooks/useToken';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { SurveyForm, SurveyFormService } from '../services/survey-form.service';

export const useSurveyForms = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const restaurant = useSelector((state: RootState) => state.restaurant);

    const dispatch: Dispatch<AllActions> = useDispatch();
    const tokenController = useToken();

    const surveyFormService = new SurveyFormService();

    const getSurveyForms = () => {
        const token = tokenController.execute();

        if (!token) return;

        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .getMany(token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_SURVEY_FORMS, payload: res.data });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened');
            });
    };

    const updateSurveyForm = (surveyFormId: number, input: Partial<SurveyForm>, form: SurveyForm) => {
        const token = tokenController.execute();
        if (!token) return;
        if (input.isPublic && !form.questions.length) {
            message.error("You cant' public this form because it doesn't have any questions saved");
            return;
        }
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .updateSurveyForm(input, token, surveyFormId, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.UPDATE_SURVEY_FORM, payload: res.data });
                message.success('Survey Form Updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        if (!restaurant.isLoading) {
            getSurveyForms();
        }
    }, [restaurant.isLoading]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { isLoading, restaurant, updateSurveyForm };
};
