import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useToken } from '../hooks/useToken';
import { SurveyFormService } from '../services/survey-form.service';
import { Dispatch } from 'redux';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { message } from 'antd';

export enum TypesQuestion {
    SMILEY = 'Smiley',
    RATING = 'Rating',
    TEXT = 'Text',
    YES_OR_NO = 'Yes/No',
}

export interface TypeQuestionState {
    value: TypesQuestion;
}

export interface Question {
    id?: number;
    value: string;
    type: TypesQuestion;
    isMandatoryQuestion: boolean;
}

export const initialStateQuestion = { value: '', type: TypesQuestion.TEXT, isMandatoryQuestion: false };

export const useCreateSurveyForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [nameAndHeader, setNameAndHeader] = useState({ name: '', header: '' });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const history = useHistory();
    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();

    const surveyFormService = new SurveyFormService();

    const addQuestion = () => {
        const newState = [...questions];
        newState.push({ ...initialStateQuestion });
        setQuestions(newState);
    };

    const removeQuestion = (indexToRemove: number) => {
        const newState = [...questions];
        newState.splice(indexToRemove, 1);
        setQuestions(newState);
    };

    const onChangeQuestion = (indexToUpdate: number, text: string) => {
        const newState = [...questions];
        newState[indexToUpdate].value = text;
        setQuestions(newState);
    };

    const onChangeMandatory = (indexToUpdate: number, value: boolean) => {
        const newState = [...questions];
        newState[indexToUpdate].isMandatoryQuestion = value;
        setQuestions(newState);
    };

    const onChangeType = (indexToUpdate: number, value: TypesQuestion) => {
        const newState = [...questions];
        newState[indexToUpdate].type = value;
        setQuestions(newState);
    };

    const saveSurveyform = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .create({ ...nameAndHeader, questions }, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.ADD_SURVEY_FORM, payload: res.data });
                message.success('Survey Form Saved Successfully!');
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

    return {
        history,
        nameAndHeader,
        questions,
        isLoading,
        removeQuestion,
        setQuestions,
        addQuestion,
        onChangeType,
        onChangeMandatory,
        setNameAndHeader,
        onChangeQuestion,
        saveSurveyform,
    };
};
