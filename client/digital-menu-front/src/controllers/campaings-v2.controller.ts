import { message } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { Campaing, CampaingService, CreateCampaingInput } from '../services/campaing.service';
import { ImageService } from '../services/image.service';
import { MenuService } from '../services/menu.service';
import { Dispatch } from 'redux';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import axios, { AxiosError, CancelTokenSource } from 'axios';

export interface InitialValuesCreateCampaing {
    title: string;
    description: string;
    willTriggeredWhen: LabeledValue;
    startsWhenSelectedMenu?: LabeledValue;
    startsWhenSelectedPlate?: LabeledValue;
    startsAfterSeconds?: number;
    banner?: File | string;
    content?: File | string;
    publish: boolean;
}

export enum CampaingTriggered {
    MENU_SELECTED = 'MENU_SELECTED',
    PLATE_SELECTED = 'PLATE_SELECTED',
    CERTAIN_TIME = 'CERTAIN_TIME',
}

export const useCampaingsV2 = () => {
    const [visible, setVisible] = useState(false);
    const [optionsPlate, setOptionsPlate] = useState<LabeledValue[]>();
    const [optionsMenu, setOptionsMenu] = useState<LabeledValue[]>();
    const [isLoadingQuery, setIsLoadingQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [plateQueryRequest, setPlateQueryRequest] = useState<string>('');
    const [menuQueryRequest, setMenuQueryRequest] = useState<string>('');
    const [currentCampaingEdit, setCurrentCampaingEdit] = useState<Campaing>();
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const menuService = new MenuService();
    const imageService = new ImageService();
    const campaingService = new CampaingService();

    const tokenController = useToken();
    const restaurant = useSelector((state: RootState) => state.restaurant);
    const dispatch: Dispatch<AllActions> = useDispatch();

    const willTriggeredWhenOptions: LabeledValue[] = [
        { label: 'Menu Selected', value: CampaingTriggered.MENU_SELECTED, key: '1' },
        { label: 'Plate Selected', value: CampaingTriggered.PLATE_SELECTED, key: '2' },
        { label: 'Certain Time', value: CampaingTriggered.CERTAIN_TIME, key: '3' },
    ];

    const initValuesCreateCampaing: InitialValuesCreateCampaing = {
        title: '',
        description: '',
        publish: true,
        willTriggeredWhen: willTriggeredWhenOptions[2],
    };

    const initialValuesEditCampaing: InitialValuesCreateCampaing = {
        ...currentCampaingEdit,
        description: currentCampaingEdit?.description || '',
        publish: currentCampaingEdit?.publish || false,
        title: currentCampaingEdit?.title || '',
        willTriggeredWhen:
            currentCampaingEdit?.willTriggeredWhen === CampaingTriggered.CERTAIN_TIME
                ? willTriggeredWhenOptions[2]
                : currentCampaingEdit?.willTriggeredWhen === CampaingTriggered.MENU_SELECTED
                ? willTriggeredWhenOptions[0]
                : willTriggeredWhenOptions[1],
        startsWhenSelectedMenu: {
            label: currentCampaingEdit?.startsWhenSelectedMenu?.name,
            value: currentCampaingEdit?.startsWhenSelectedMenu?.id || '',
        },
        startsWhenSelectedPlate: {
            label: currentCampaingEdit?.startsWhenSelectedPlate?.title,
            value: currentCampaingEdit?.startsWhenSelectedPlate?.id || '',
        },
    };

    const handleVisible = () => {
        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    const getPlatesBySearch = (query: string) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoadingQuery(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .getPlatesByName(query, token, cancelToken.token)
            .then((res) => {
                const platesDto: LabeledValue[] = res.data.map((plate, index) => ({
                    label: plate.title,
                    value: plate.id,
                    key: index.toString(),
                }));
                setOptionsPlate(platesDto);
                setIsLoadingQuery(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setIsLoadingQuery(false);
            });
    };

    const getMenusBySearch = (query: string) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoadingQuery(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .getManyWithPagination('?limit=5&page=1&search=' + query + '&onlyNameMenu=true', token, cancelToken.token)
            .then((res) => {
                setIsLoadingQuery(false);
                const optionsDto: LabeledValue[] = res.data.items.map((menu, index) => ({
                    label: menu.name,
                    value: menu.id,
                    key: index.toString(),
                }));
                setOptionsMenu(optionsDto);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setIsLoadingQuery(false);
            });
    };

    const createCampaing = async (input: InitialValuesCreateCampaing) => {
        const token = tokenController.execute();
        if (!token || !input.content || !input.banner) return;
        setIsLoading(true);
        const images = await Promise.all(
            [input.banner, input.content].map(async (file) => {
                try {
                    const cancelToken = axios.CancelToken.source();
                    // setCancelTokenSource(cancelToken);
                    const response = await imageService.execute(file, cancelToken.token);
                    return response.data.secure_url;
                } catch (err) {
                    return null;
                }
            }),
        );
        if (!images[0] || !images[1]) return message.error('An error happened on update images. Please, try again.');
        const campaingDto = Object.keys(input).reduce((prev, currentKey) => {
            const inputWithKeys = { ...input } as { [key: string]: any };
            let currentValue = inputWithKeys[currentKey];
            switch (currentKey) {
                case 'banner':
                    currentValue = images[0];
                    break;

                case 'content':
                    currentValue = images[1];
                    break;

                case 'willTriggeredWhen':
                case 'startsWhenSelectedPlate':
                case 'startsWhenSelectedMenu':
                    currentValue = currentValue?.value;
                    break;
            }
            return {
                ...prev,
                [currentKey]: currentValue,
            };
        }, {} as CreateCampaingInput);

        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        campaingService
            .create(campaingDto, token, cancelToken.token)
            .then((res) => {
                dispatch({ type: RestaurantActionsTypes.ADD_CAMPAING, payload: res.data });
                setIsLoading(false);
                message.success('Campaing saved successfully!');
                handleVisible();
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const fetchCampaings = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        campaingService
            .getMany(token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_CAMPAINGS, payload: res.data });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_CAMPAINGS, payload: [] });
            });
    };

    const updateCampaing = async (input: InitialValuesCreateCampaing) => {
        const token = tokenController.execute();
        if (!token || !input.content || !input.banner || !currentCampaingEdit) return;
        setIsLoading(true);
        const images = await Promise.all(
            [input.banner, input.content].map(async (file) => {
                if (typeof file === 'string' && isURL(file)) return file;
                try {
                    const cancelToken = axios.CancelToken.source();
                    setCancelTokenSource(cancelToken);
                    const response = await imageService.execute(file, cancelToken.token);
                    return response.data.secure_url;
                } catch (err) {
                    return null;
                }
            }),
        );
        if (!images[0] || !images[1]) return message.error('An error happened on update images. Please, try again.');
        const campaingDto = Object.keys(input).reduce((prev, currentKey) => {
            const inputWithKeys = { ...input } as { [key: string]: any };
            let currentValue = inputWithKeys[currentKey];
            switch (currentKey) {
                case 'banner':
                    currentValue = images[0];
                    break;

                case 'content':
                    currentValue = images[1];
                    break;

                case 'willTriggeredWhen':
                case 'startsWhenSelectedPlate':
                case 'startsWhenSelectedMenu':
                    currentValue = currentValue?.value;
                    break;
            }
            return {
                ...prev,
                [currentKey]: currentValue,
            };
        }, {} as CreateCampaingInput);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        campaingService
            .update(campaingDto, token, currentCampaingEdit?.id, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.UPDATE_CAMPAING,
                    payload: { newData: res.data, campaingId: currentCampaingEdit.id },
                });
                setCurrentCampaingEdit(undefined);
                message.success('Campaing Updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const isURL = (url: string): boolean => {
        const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        return regex.test(url);
    };

    const deleteCampaing = (campaingId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        campaingService
            .delete(token, campaingId, cancelToken.token)
            .then((_) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.REMOVE_CAMPAING,
                    payload: { campaingId },
                });
                message.success('Campaing deleted successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    const changePublish = (campaingId: number) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        campaingService
            .updatePublish(token, campaingId, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.UPDATE_CAMPAING,
                    payload: { campaingId: campaingId, newData: { publish: res.data.publish } },
                });
                message.success('Campaing updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        if (plateQueryRequest) {
            const timeout = setTimeout(() => {
                getPlatesBySearch(plateQueryRequest);
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        } else {
            setOptionsPlate(undefined);
        }
    }, [plateQueryRequest]);

    useEffect(() => {
        if (menuQueryRequest) {
            const timeout = setTimeout(() => {
                getMenusBySearch(menuQueryRequest);
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        } else {
            setOptionsMenu(undefined);
        }
    }, [menuQueryRequest]);

    useEffect(() => {
        if (!restaurant.isLoading) {
            fetchCampaings();
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
        handleVisible,
        getPlatesBySearch,
        getMenusBySearch,
        setPlateQueryRequest,
        setMenuQueryRequest,
        createCampaing,
        updateCampaing,
        changePublish,
        setCurrentCampaingEdit,
        deleteCampaing,
        currentCampaingEdit,
        isLoading,
        willTriggeredWhenOptions,
        isLoadingQuery,
        plateQueryRequest,
        menuQueryRequest,
        visible,
        initValuesCreateCampaing,
        initialValuesEditCampaing,
        restaurant,
        optionsPlate,
        optionsMenu,
    };
};
