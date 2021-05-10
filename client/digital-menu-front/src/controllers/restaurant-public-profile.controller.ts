import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderActionsTypes } from '../interfaces/Order/order.interface';
import { MenuInterface, PlateInterface } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { CreateOrder, OrderService, PaymentMethod, PlateMinimized } from '../services/order.service';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantInterfaceExtended } from './restaurant-searcher.controller';
import { Dispatch } from 'redux';
import { useHistory } from 'react-router';
import { UserRoles } from '../interfaces/User';
import { useMediaQuery } from 'react-responsive';
import { Campaing } from '../services/campaing.service';
import { MenuService } from '../services/menu.service';

export interface Order {
    quantity: number;
    isHover: boolean;
}

export type IStepsConfirmOrder = 'first' | 'second' | 'thrid';

export interface ConfirmOrder {
    firstName: string;
    lastName: string;
    tableId?: number;
    securityPassword: string;
    paymentMethod: PaymentMethod;
}

export type OrderExtended = PlateInterface & Order;

export interface CampaingInterval {
    contentVisible?: boolean;
    bannerVisible?: boolean;
    campaing?: Campaing;
}

export interface Counter {
    id: number;
    count: number;
}

export const useRestaurantPublicProfile = () => {
    const [restaurant, setRestaurant] = useState<RestaurantInterfaceExtended | null>(null);
    const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
    const [order, setOrder] = useState<OrderExtended[]>([]);
    const [visibleConfirmOrder, setVisibleConfirmOrder] = useState(false);
    const [clarificationsAboutOrder, setClarificationsAboutOrder] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentCampaing, setCurrentCampaing] = useState<CampaingInterval>({
        bannerVisible: undefined,
        contentVisible: undefined,
        campaing: undefined,
    });
    const [currentMenu, setCurrentMenu] = useState<MenuInterface>();
    const [isLoadingMenu, setIsLoadingMenu] = useState({ id: 0, isLoading: false });
    const [counterMenu, setCounterMenu] = useState<Counter[]>([]);
    const [counterPlate, setCounterPlate] = useState<Counter[]>([]);
    const [lastCounterPlate, setLastCounterPlate] = useState<number>();
    const [stepsConfirmOrder, setStepsConfirmOrder] = useState<IStepsConfirmOrder>('first');
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const restaurantService = new RestaurantService();
    const orderService = new OrderService();
    const menuService = new MenuService();

    const history = useHistory();
    const dispatch: Dispatch<AllActions> = useDispatch();
    const orderReducer = useSelector((state: RootState) => state.order);
    const user = useSelector((state: RootState) => state.user);

    const isBreakpoint = useMediaQuery({
        query: '(max-width:800px)',
    });

    const currentMenuId = new URL(window.location.href).searchParams.get('menu_id');

    const isWatchingRestaurant =
        new URL(window.location.href).searchParams.get('as_restaurant') && user.role?.[0] === UserRoles.OWNER;

    const rateCalculated = restaurant?.reviewsSurveyForm?.length
        ? restaurant.reviewsSurveyForm
              .map((review) => Number(review.value))
              .reduce((prev, current) => {
                  return prev + current;
              }, 0) / restaurant.reviewsSurveyForm.length
        : 0;

    const handleOpen = () => {
        if (visibleConfirmOrder) {
            setVisibleConfirmOrder(false);
        } else {
            setVisibleConfirmOrder(true);
        }
    };

    const addPlateToOrder = (input: OrderExtended) => {
        setOrder([...order, input]);
        if (isBreakpoint) {
            message.success('Plate added to order');
        }
    };

    const handleVisibleMenu = (plateId: number) => {
        const orderUpdated = order.map((plate) => {
            if (plate.id === plateId) return { ...plate, isHover: plate.isHover ? false : true };
            return plate;
        });
        setOrder(orderUpdated);
    };

    const clearOrder = () => {
        setOrder([]);
        setClarificationsAboutOrder('');
    };

    const updatePlateFromOrder = (plateId: number, newPlateData: Partial<OrderExtended>) => {
        setOrder((prevState) =>
            prevState.map((plate) => {
                if (plate.id === plateId) return { ...plate, ...newPlateData };
                return plate;
            }),
        );
    };

    const removePlateFromOrder = (plateId: number) => {
        const orderUpdated = order.filter((plate) => plate.id !== plateId);
        setOrder(orderUpdated);
    };

    const twoMenus = () => {
        const quantityMenus = restaurant?.menus?.length;
        if (!quantityMenus) return [];
        if (quantityMenus < 2) return [restaurant?.menus[0]];
        return [restaurant?.menus[0], restaurant?.menus[1]];
    };

    const createOrder = (input: ConfirmOrder) => {
        if (user.role && user.role[0] === UserRoles.OWNER) {
            return message.error("You can't order as restaurant");
        }
        const orderDto = returnOrderDto(input);
        const restaurantId = getRestaurantId();
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        orderService
            .createOrder(orderDto, restaurantId, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                message.success('Order created successfully!');
                dispatch({ type: OrderActionsTypes.SET_ORDER, payload: res.data });
                history.push('/order?id=' + res.data.id);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected Error!');
                dispatch({ type: OrderActionsTypes.CLEAR_ORDER });
            });
    };

    const returnOrderDto = (values: ConfirmOrder): CreateOrder => {
        const platesMinimized: PlateMinimized[] = order.map((plate) => {
            return {
                quantity: plate.quantity,
                id: plate.id,
            };
        });
        const orderDto: CreateOrder = {
            ...values,
            clarifications: clarificationsAboutOrder,
            plates: platesMinimized,
        };
        return orderDto;
    };

    const getRestaurantId = (): number => {
        const url = new URL(window.location.href);
        return Number(url.searchParams.get('id'));
    };

    const getMenuById = (menuId: number) => {
        setIsLoadingMenu({ id: menuId, isLoading: true });
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService
            .getOneById(menuId, cancelToken.token)
            .then((res) => {
                setIsLoadingMenu((prevState) => ({ ...prevState, isLoading: false }));
                setCurrentMenu(res.data);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingMenu((prevState) => ({ ...prevState, isLoading: false }));
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        if (currentMenuId) {
            getMenuById(Number(currentMenuId));
        } else {
            setCurrentMenu(undefined);
        }
    }, [currentMenuId]);

    useEffect(() => {
        const url = new URL(window.location.href);
        const restaurantId = url.searchParams.get('id');
        if (!restaurantId || Number.isNaN(restaurantId)) {
            setIsLoadingRestaurant(false);
            return;
        }
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .getRestaurantbyId(Number(restaurantId), cancelToken.token)
            .then((res) => {
                setRestaurant(res.data);
                setIsLoadingRestaurant(false);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingRestaurant(false);
            });
    }, []);

    useEffect(() => {
        if (!isLoadingRestaurant) {
            const campaingsTimeOuts = restaurant?.campaings.map((campaing) => {
                if (campaing.startsAfterSeconds)
                    return setTimeout(() => {
                        setCurrentCampaing({ bannerVisible: true, contentVisible: false, campaing });
                    }, Number(campaing.startsAfterSeconds) * 1000);
            });
            return () => {
                campaingsTimeOuts?.map((timeout) => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                });
            };
        }
    }, [restaurant?.campaings, isLoadingRestaurant]);

    useEffect(() => {
        if (currentMenu) {
            window.scrollTo({ behavior: 'smooth', top: 0 });
        }
    }, [currentMenu]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        restaurant,
        isLoadingRestaurant,
        order,
        clarificationsAboutOrder,
        visibleConfirmOrder,
        isLoading,
        orderReducer,
        history,
        isWatchingRestaurant,
        setStepsConfirmOrder,
        stepsConfirmOrder,
        isBreakpoint,
        currentMenu,
        isLoadingMenu,
        rateCalculated,
        currentCampaing,
        counterPlate,
        counterMenu,
        lastCounterPlate,
        setCurrentCampaing,
        twoMenus,
        setLastCounterPlate,
        setCounterPlate,
        addPlateToOrder,
        setCounterMenu,
        clearOrder,
        setClarificationsAboutOrder,
        updatePlateFromOrder,
        handleOpen,
        createOrder,
        handleVisibleMenu,
        removePlateFromOrder,
    };
};
