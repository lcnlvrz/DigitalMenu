import { message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlatePublicCard } from '../components/PlatePublicCard/PlatePublicCard';
import { UserRoles } from '../interfaces/User';
import { RootState } from '../redux/reducers/root-state.reducer';
import { Campaing } from '../services/campaing.service';
import { MenuService } from '../services/menu.service';

export const usePlatePublicCard = (props: PlatePublicCard) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [orderExtended, setOrderExtended] = useState({ quantity: 1 });
    const [visibleCampaingBanner, setVisibleCampaingBanner] = useState(false);
    const [visibleCampaingContent, setVisibleCampaingContent] = useState(false);
    const [campaing, setCampaing] = useState<Campaing>();
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const menuService = new MenuService();

    const updatePlateViews = () => {
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        menuService.updatePlateViews(props.plate.id, cancelToken.token);
    };

    const user = useSelector((state: RootState) => state.user);

    const handleOpen = () => {
        if (isOpenModal) {
            setOrderExtended({ quantity: 1 });
            setIsOpenModal(false);
        } else {
            setIsOpenModal(true);
        }
    };

    const onClickCard = () => {
        if (user.role?.[0] !== UserRoles.OWNER) {
            updatePlateViews();
        }
        handleOpen();
        const indexPlateInCounter = props.counter?.findIndex((count) => count.id === props.plate.id);
        const newState = props.counter ? [...props.counter] : [];
        if (indexPlateInCounter !== -1 && indexPlateInCounter !== undefined) {
            newState[indexPlateInCounter].count = newState[indexPlateInCounter].count + 1;
            props.setCounter(newState);
        } else {
            newState.push({ count: 1, id: props.plate.id });
            props.setCounter(newState);
        }
    };

    const addPlateToOrder = () => {
        if (!props.order.findIndex((plate) => plate.id === props.plate.id)) {
            message.error('This plate is already in the order');
        } else {
            props.addPlateToOrder({
                ...props.plate,
                ...orderExtended,
                isHover: false,
            });
            handleOpen();
        }
    };

    useEffect(() => {
        const plateCampaing = props.campaings?.filter(
            (campaing) => campaing?.startsWhenSelectedPlate?.id === props.plate.id,
        )[0];
        const counterPlate = props.counter?.filter((counter) => counter.id === props?.plate?.id)[0];
        if (
            Number.isInteger(Number(counterPlate?.count) / 4) &&
            plateCampaing &&
            counterPlate?.count !== props.lastCounterPlate
        ) {
            props.setLastCounterPlate(counterPlate?.count);
            setVisibleCampaingBanner(true);
            setCampaing(plateCampaing);
        } else {
            setCampaing(undefined);
            setVisibleCampaingBanner(false);
            setVisibleCampaingContent(false);
        }
    }, [props.counter]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        isOpenModal,
        handleOpen,
        setOrderExtended,
        setVisibleCampaingBanner,
        updatePlateViews,
        setVisibleCampaingContent,
        addPlateToOrder,
        onClickCard,
        orderExtended,
        campaing,
        user,
        visibleCampaingBanner,
        visibleCampaingContent,
    };
};
