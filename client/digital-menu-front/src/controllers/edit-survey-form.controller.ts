import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useToken } from '../hooks/useToken';
import { SurveyFormService } from '../services/survey-form.service';
import { Dispatch } from 'redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Question, TypesQuestion } from './create-survey-form.controller';

export const initialStateQuestion = { value: '', type: TypesQuestion.TEXT, isMandatoryQuestion: false };

export const useEditSurveyForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [nameAndHeader, setNameAndHeader] = useState({ header: '', name: '' });
    const [notFound, setNotFound] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const history = useHistory();
    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();

    const restaurant = useSelector((state: RootState) => state.restaurant);

    const surveyFormService = new SurveyFormService();

    const isDisabled =
        !questions.length ||
        !nameAndHeader.header ||
        !nameAndHeader.name ||
        questions.filter((question) => !question.value).length > 0;

    const getSurveyForm = () => {
        const token = tokenController.execute();
        if (!token) return;
        const url = new URL(window.location.href);
        const surveyFormId = Number(url.searchParams.get('id'));
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .getOneById(surveyFormId, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.UPDATE_SURVEY_FORM, payload: res.data });
                setQuestions(res.data.questions);
                setNameAndHeader({ header: res.data.header, name: res.data.name });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                setNotFound(true);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const addQuestion = () => {
        if (questions) {
            const newState = [...questions];
            newState.push({ ...initialStateQuestion });
            setQuestions(newState);
        }
    };

    const removeQuestion = (indexToRemove: number, questionId?: number) => {
        const url = new URL(window.location.href);
        const surveyFormId = Number(url.searchParams.get('id'));

        const token = tokenController.execute();
        if (!token) return;

        if (questionId) {
            setIsLoading(true);
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            surveyFormService
                .removeQuestion(questionId, token, cancelToken.token)
                .then((res) => {
                    setIsLoading(false);
                    dispatch({
                        type: RestaurantActionsTypes.REMOVE_QUESTION_FROM_SURVEY_FORM,
                        payload: { indexToRemove, questionId, surveyFormId },
                    });
                    if (res.data.isChangedStatus) {
                        dispatch({
                            type: RestaurantActionsTypes.UPDATE_SURVEY_FORM,
                            payload: { id: surveyFormId, isPublic: false },
                        });
                        message.info(
                            "Survey Form visibility changed to hidden because it doesn't have any saved questions",
                        );
                    }
                })
                .catch((err: AxiosError) => {
                    if (axios.isCancel(err)) return;
                    setIsLoading(false);
                    message.error(err.response?.data?.detail || 'Unexpected error happened!');
                });
        }

        if (questions) {
            const newState = [...questions];
            newState.splice(indexToRemove, 1);
            setQuestions(newState);
        }
    };

    const onChangeQuestion = (indexToUpdate: number, text: string) => {
        if (questions) {
            const newState = [...questions];
            newState[indexToUpdate].value = text;
            setQuestions(newState);
        }
    };

    const onChangeMandatory = (indexToUpdate: number, value: boolean) => {
        if (questions) {
            const newState = [...questions];
            newState[indexToUpdate].isMandatoryQuestion = value;
            setQuestions(newState);
        }
    };

    const onChangeType = (indexToUpdate: number, value: TypesQuestion) => {
        if (questions) {
            const newState = [...questions];
            newState[indexToUpdate].type = value;
            setQuestions(newState);
        }
    };

    const updateSurveyForm = () => {
        const token = tokenController.execute();
        if (!token) return;
        const url = new URL(window.location.href);
        const surveyFormId = Number(url.searchParams.get('id'));
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .updateSurveyForm(
                { name: nameAndHeader.name, header: nameAndHeader.header, questions },
                token,
                surveyFormId,
                cancelToken.token,
            )
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
            getSurveyForm();
        }
    }, []);

    useEffect(() => {
        if (restaurant.surveyForms) {
            const url = new URL(window.location.href);
            const surveyFormId = Number(url.searchParams.get('id'));
            const surveyFormIndex = restaurant.surveyForms.findIndex((value) => value.id === surveyFormId);
            setQuestions(restaurant.surveyForms[surveyFormIndex].questions);
        }
    }, [restaurant.surveyForms]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        history,
        isLoading,
        restaurant,
        questions,
        nameAndHeader,
        notFound,
        isDisabled,
        removeQuestion,
        setQuestions,
        addQuestion,
        onChangeType,
        onChangeMandatory,
        onChangeQuestion,
        setNameAndHeader,
        updateSurveyForm,
    };
};
