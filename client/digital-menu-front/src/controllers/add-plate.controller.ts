import { Input, message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { CreatePlate } from '../components/AddPlate/AddPlate';
import { useToken } from '../hooks/useToken';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { ImageService } from '../services/image.service';
import { MenuService } from '../services/menu.service';

export const useAddPlate = () => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState({
        tags: ['Meat'],
        inputVisible: false,
        inputValue: '',
        editInputIndex: -1,
        editInputValue: '',
    });
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const inputRef: LegacyRef<Input> = useRef(null);
    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();

    const menuService = new MenuService();
    const imageService = new ImageService();

    const initialValuesAddPlate: CreatePlate = {
        title: '',
        description: '',
        price: '',
        weight: 1,
        ingredients: tags.tags,
        image: '',
        preparationTime: 2,
    };

    const handleOpen = () => {
        if (visible) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    const handleClose = (
        removedTag: any,
        setValues: (values: React.SetStateAction<CreatePlate>, shouldValidate?: boolean | undefined) => void,
    ) => {
        const tagsFiltered = tags.tags.filter((tag) => tag !== removedTag);
        setTags({ ...tags, tags: tagsFiltered });
        setValues((prevState) => ({ ...prevState, ingredients: tagsFiltered }));
    };

    const showInput = () => {
        setTags({ ...tags, inputVisible: true });
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags({ ...tags, inputValue: e.target.value });
    };

    const handleInputConfirm = (
        setValues: (values: React.SetStateAction<CreatePlate>, shouldValidate?: boolean | undefined) => void,
    ) => {
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
        setValues((prevState) => ({ ...prevState, ingredients: tagsArray }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags({ ...tags, editInputValue: e.target.value });
    };

    const handleEditInputConfirm = (
        setValues: (values: React.SetStateAction<CreatePlate>, shouldValidate?: boolean | undefined) => void,
    ) => {
        const newTags = [...tags.tags];
        newTags[tags.editInputIndex] = tags.editInputValue;
        setTags({ ...tags, tags: newTags, editInputIndex: -1, editInputValue: '' });
        setValues((prevState) => ({ ...prevState, ingredients: newTags }));
    };

    const handleDoubleClick = (index: number, tag: string, e: React.MouseEvent) => {
        if (index !== 0) {
            setTags({ ...tags, editInputIndex: index, editInputValue: tag });
            inputRef.current?.focus();
            e.preventDefault();
        }
    };

    const createPlate = (input: CreatePlate, menuId: number) => {
        const token = tokenController.execute();
        if (!token || !input.image) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        imageService
            .execute(input.image, cancelToken.token)
            .then((res) => {
                const cancelTokenTwo = axios.CancelToken.source();
                setCancelTokenSource(cancelTokenTwo);
                menuService
                    .createPlate(
                        { ...input, price: Number(input.price), image: res.data.secure_url, menuId },
                        token,
                        cancelTokenTwo.token,
                    )
                    .then((res) => {
                        setIsLoading(false);
                        dispatch({ type: RestaurantActionsTypes.ADD_NEW_PLATE, payload: { ...res.data, menuId } });
                        handleOpen();
                        message.success('Plate created successfully!');
                    })
                    .catch((err: AxiosError) => {
                        if (axios.isCancel(err)) return;
                        setIsLoading(false);
                        message.error(err.response?.data?.detail || 'Unexpected error!');
                    });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
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
        tags,
        visible,
        isLoading,
        handleOpen,
        handleClose,
        showInput,
        createPlate,
        initialValuesAddPlate,
        handleInputChange,
        handleInputConfirm,
        handleDoubleClick,
        handleEditInputChange,
        handleEditInputConfirm,
        inputRef,
    };
};
