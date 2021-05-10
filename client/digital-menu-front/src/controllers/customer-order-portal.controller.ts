import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { OrderService, OrderStatus } from '../services/order.service';
import { Dispatch } from 'redux';
import { OrderActionsTypes } from '../interfaces/Order/order.interface';
import { useHistory } from 'react-router';
import { UserRoles } from '../interfaces/User';
import { RestaurantService } from '../services/restaurant.service';
import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import * as Yup from 'yup';
import { Question, TypesQuestion } from './create-survey-form.controller';
import { SurveyFormService } from '../services/survey-form.service';

export interface Review {
    stars: number;
    comment: string;
}

export enum EmojiStatus {
    SAD = 'SAD',
    MEH = 'MEH',
    SMILE = 'SMILE',
}

export interface KeyString {
    [key: string]: boolean | number | string;
}

export interface Answer {
    type: TypesQuestion;
    question: string;
    answer: any;
    index: number;
}

export const useCustomerOrderPortal = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const history = useHistory();
    const order = useSelector((state: RootState) => state.order);
    const orderService = new OrderService();
    const restaurantService = new RestaurantService();
    const surveyFormService = new SurveyFormService();

    const user = useSelector((state: RootState) => state.user);
    const dispatch: Dispatch<AllActions> = useDispatch();

    const handleOpen = () => {
        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    const getOrderId = () => {
        const url = new URL(window.location.href);
        return Number(url.searchParams.get('id'));
    };

    const fetchOrder = () => {
        const orderId = getOrderId();
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        orderService
            .getOrderById(orderId, cancelToken.token)
            .then((res) => {
                dispatch({ type: OrderActionsTypes.SET_ORDER, payload: res.data });
                setIsLoading(false);
                if (res.data.surveyFormResponse) {
                    history.push('/order?id=' + res.data.id + '&success_survey_form=true');
                }
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error');
            });
    };

    const createReview = (input: Review) => {
        const orderId = getOrderId();
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .createReview(input, orderId, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: OrderActionsTypes.SET_REVIEW, payload: res.data });
                handleOpen();
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected Error!');
            });
    };

    const titleTooptipStatus = (() => {
        switch (order.status) {
            case OrderStatus.IN_QUEUE:
                return 'In Queue means that the restaurant has received your order but is waiting for a slot to start with your order';

            case OrderStatus.COOKING:
                return 'Cooking means that the restaurant has started cooking and preparing your order';

            case OrderStatus.DELIVERED:
                return 'Delivered means that the restaurant served the plates of the order';

            case OrderStatus.WITH_DELAY:
                return 'With Delay means that the restaurant has some troubles with your order. Thats why the order probabily is going to be deliver with a little delay';

            case OrderStatus.CANCELED:
                return 'Canceled means that the restaurant canceled the order. The reason is unknown';

            case OrderStatus.DONE:
                return 'Done means that the order was delivered and charged. This status is the final of the cycle';
        }
    })();

    const tagColorStatus = (() => {
        switch (order.status) {
            case OrderStatus.IN_QUEUE:
                return 'default';

            case OrderStatus.COOKING:
                return 'volcano';

            case OrderStatus.DELIVERED:
                return 'gold';

            case OrderStatus.WITH_DELAY:
                return 'warning';

            case OrderStatus.CANCELED:
                return 'error';

            case OrderStatus.DONE:
                return 'success';
        }
    })();

    const validationSchema = () => {
        return order.restaurant?.surveyForms[0].questions.reduce((prev, current, index) => {
            return {
                ...prev,
                [index.toString()]: (() => {
                    switch (current.type) {
                        case TypesQuestion.RATING:
                            if (current.isMandatoryQuestion) {
                                return Yup.number().required('Required!');
                            } else {
                                return Yup.number().notRequired();
                            }

                        case TypesQuestion.SMILEY:
                            if (current.isMandatoryQuestion) {
                                return Yup.string().oneOf(['SAD', 'MEH', 'SMILE'], 'Choose one').required('Required!');
                            } else {
                                return Yup.string().oneOf(['SAD', 'MEH', 'SMILE']).notRequired();
                            }

                        case TypesQuestion.TEXT:
                            if (current.isMandatoryQuestion) {
                                return Yup.string().required('Required!');
                            } else {
                                return Yup.string().notRequired();
                            }

                        case TypesQuestion.YES_OR_NO:
                            if (current.isMandatoryQuestion) {
                                return Yup.string().oneOf(['YES', 'NO'], 'Choose One!').required('Required!');
                            } else {
                                return Yup.string().oneOf(['YES', 'NO']).notRequired();
                            }
                    }
                })(),
            };
        }, {});
    };

    const onChangeAnswer = (question: Question, index: number, value: any) => {
        const indexToUpdate = answers.findIndex((answer) => answer.index === index);
        const newState = [...answers];
        if (indexToUpdate !== -1) {
            newState[indexToUpdate].answer = value;
        } else {
            newState.push({ answer: value, index, question: question.value, type: question.type });
        }
        setAnswers(newState);
    };

    const isSucessSurveyForm =
        new URL(window.location.href).searchParams.get('success_survey_form') && order.surveyFormResponse;

    const sendResponse = () => {
        const input = answers.map((answer) => {
            const { index, ...rest } = answer;
            return rest;
        });
        if (order.restaurant?.surveyForms && order.id) {
            setIsLoading(true);
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            surveyFormService
                .createSurveyFormResponse(
                    {
                        answers: input,
                        surveyFormId: order.restaurant?.surveyForms[0].id,
                        orderId: order.id,
                    },
                    cancelToken.token,
                )
                .then((res) => {
                    setIsLoading(false);
                    dispatch({
                        type: OrderActionsTypes.SET_SURVEY_FORM_RESPONSE,
                        payload: res.data,
                    });
                    history.push('/order?id=' + order.id + '&success_survey_form=true');
                    message.success('Form sent successfully!');
                })
                .catch((err: AxiosError) => {
                    if (axios.isCancel(err)) return;
                    setIsLoading(false);
                    message.error(err.response?.data?.detail || 'Unexpected error happened!');
                });
        }
    };

    const initialValuesFormik: KeyString = order.restaurant?.surveyForms?.length
        ? order.restaurant.surveyForms[0].questions?.reduce((prev, current, index) => {
              return {
                  ...prev,
                  [index.toString()]: current.type === TypesQuestion.RATING ? 0 : '',
              };
          }, {})
        : {};

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        if (!user.isLoading && user.role) {
            if (user.role[0] === UserRoles.OWNER) {
                history.push('/dashboard/my-restaurant');
            }
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        isLoading,
        order,
        isSucessSurveyForm,
        fetchOrder,
        tagColorStatus,
        createReview,
        handleOpen,
        setAnswers,
        onChangeAnswer,
        sendResponse,
        answers,
        titleTooptipStatus,
        visible,
        validationSchema,
        initialValuesFormik,
    };
};
