import { LegacyRef, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { PlateInterface, RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { MenuService } from '../services/menu.service';
import { Dispatch } from 'redux';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { Input, message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';

export interface UsePlateCardParams {
    ingredients: string[];
    plateId: number;
    menuId: number;
    preparationTime: number;
}

export const usePlateCard = (params: UsePlateCardParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [tags, setTags] = useState({
        tags: params.ingredients,
        inputVisible: false,
        inputValue: '',
        editInputIndex: -1,
        editInputValue: '',
    });

    const [preparationTime, setPreparationTime] = useState<number>(params.preparationTime);
    const inputRef: LegacyRef<Input> = useRef(null);

    const menuService = new MenuService();

    const tokenController = useToken();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const updateInformation = (input: Partial<PlateInterface>, menuId: number, plateId: number, isModal?: boolean) => {
        const token = tokenController.execute();
        if (!token) return;

        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .updatePlateInformation({ ...input, platesIds: [plateId] }, token, cancelToken.token)
            .then((_) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.UPDATE_INFORMATION_PLATE,
                    payload: { input, menuId, plateId },
                });
                message.success('Information updated successfully!');
                if (isModal) {
                    handleOpenModal();
                }
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    const handleOpenModal = () => {
        if (isOpenModal) {
            setIsOpenModal(false);
        } else {
            setIsOpenModal(true);
        }
    };

    const handleClose = (removedTag: any) => {
        if (tags.tags.length === 1) {
            message.error('Ingredients are required!');
        } else {
            const tagsFiltered = tags.tags.filter((tag) => tag !== removedTag);
            setTags({ ...tags, tags: tagsFiltered });
            updateInformation({ ingredients: tagsFiltered }, params.menuId, params.plateId);
        }
    };

    const showInput = () => {
        setTags({ ...tags, inputVisible: true });
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags({ ...tags, inputValue: e.target.value });
    };

    const handleInputConfirm = () => {
        const { inputValue } = tags;
        let { tags: tagsArray } = tags;
        if (inputValue && tagsArray.indexOf(inputValue) === -1) {
            tagsArray = [...tagsArray, inputValue];
        }
        setTags({
            ...tags,
            tags: tagsArray,
            inputVisible: false,
            inputValue: '',
        });
        updateInformation({ ingredients: tagsArray }, params.menuId, params.plateId);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags({ ...tags, editInputValue: e.target.value });
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags.tags];
        newTags[tags.editInputIndex] = tags.editInputValue;
        updateInformation({ ingredients: newTags }, params.menuId, params.plateId);
        setTags({ ...tags, tags: newTags, editInputIndex: -1, editInputValue: '' });
    };

    const handleDoubleClick = (index: number, tag: string, e: React.MouseEvent) => {
        if (index !== 0) {
            setTags({ ...tags, editInputIndex: index, editInputValue: tag });
            inputRef.current?.focus();
            e.preventDefault();
        }
    };

    const duplicatePlate = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .duplicatePlate(params.plateId, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({
                    type: RestaurantActionsTypes.ADD_NEW_PLATE,
                    payload: { ...res.data, menuId: params.menuId },
                });
                message.success('Plate Duplicated successfully!');
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
        isLoading,
        updateInformation,
        handleDoubleClick,
        handleEditInputConfirm,
        handleClose,
        tags,
        setTags,
        inputRef,
        setPreparationTime,
        preparationTime,
        handleOpenModal,
        duplicatePlate,
        isOpenModal,
        handleEditInputChange,
        handleInputConfirm,
        handleInputChange,
        showInput,
    };
};
