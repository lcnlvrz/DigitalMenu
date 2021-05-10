import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RestaurantActionsTypes, RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { RestaurantService } from '../services/restaurant.service';
import { Dispatch } from 'redux';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { message } from 'antd';
import { useUpdateRestaurant } from '../hooks/useUpdateRestaurant';

export enum Photo {
    BANNER = 'BANNER',
    PROFILE = 'PROFILE',
    NOT_SETTED = 'NOT_SETTED',
}

export const useMyRestaurant = () => {
    const [openUpdatePhoto, setOpenUpdatePhoto] = useState(false);
    const [openDeletePhoto, setOpenDeletePhoto] = useState(false);
    const [bannerOrPhoto, setBannerOrPhoto] = useState<Photo>(Photo.NOT_SETTED);
    const [isLoadingDeletePhoto, setIsLoadingDeletePhoto] = useState(false);
    const [openEditSchedule, setOpenEditSchedule] = useState(false);
    const [isLoadingEditSchedule, setIsLoadingEditSchedule] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const restaurant = useSelector((state: RootState) => state.restaurant);

    const restaurantService = new RestaurantService();

    const updateRestaurant = useUpdateRestaurant({ setIsLoading: setIsLoadingEditSchedule });

    const banner = () => {
        setBannerOrPhoto(Photo.BANNER);
    };

    const profile = () => {
        setBannerOrPhoto(Photo.PROFILE);
    };

    const handleOpenUpdatePhoto = () => {
        if (openUpdatePhoto) {
            setOpenUpdatePhoto(false);
        } else {
            setOpenUpdatePhoto(true);
        }
    };

    const handleOpenDeletePhoto = () => {
        if (openDeletePhoto) {
            setOpenDeletePhoto(false);
        } else {
            setOpenDeletePhoto(true);
        }
    };

    const handleOpenEditSchedule = () => {
        if (openEditSchedule) {
            setOpenEditSchedule(false);
        } else {
            setOpenEditSchedule(true);
        }
    };

    const removePhoto = () => {
        const input: Partial<RestaurantInterface> = {};
        if (bannerOrPhoto === Photo.BANNER) {
            input.bannerPhoto = '';
        } else {
            input.profilePhoto = '';
        }
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setIsLoadingDeletePhoto(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .updateRestaurant(input, token, cancelToken.token)
            .then((res) => {
                setIsLoadingDeletePhoto(false);
                dispatch({ type: RestaurantActionsTypes.UPDATE_RESTAURANT, payload: res.data });
                handleOpenDeletePhoto();
                message.success('Deleted successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingDeletePhoto(false);
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
        handleOpenDeletePhoto,
        restaurant,
        setBannerOrPhoto,
        banner,
        updateRestaurant,
        profile,
        handleOpenEditSchedule,
        openEditSchedule,
        handleOpenUpdatePhoto,
        removePhoto,
        setIsLoadingDeletePhoto,
        isLoadingDeletePhoto,
        isLoadingEditSchedule,
        openUpdatePhoto,
        openDeletePhoto,
        bannerOrPhoto,
    };
};
