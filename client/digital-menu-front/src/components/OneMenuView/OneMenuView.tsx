import { Button, Image } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useOneMenuView } from '../../controllers/one-menu-view.controller';
import { Counter, OrderExtended } from '../../controllers/restaurant-public-profile.controller';
import { MenuInterface, RestaurantInterface } from '../../interfaces/Restaurant/restaurant.interface';
import { Campaing } from '../../services/campaing.service';
import PlatePublicCard from '../PlatePublicCard/PlatePublicCard';

export interface OneMenuViewProps {
    isWatchingRestaurant: string | boolean | null;
    restaurant: RestaurantInterface | null;
    currentMenu: MenuInterface;
    order: OrderExtended[];
    addPlateToOrder: (input: OrderExtended) => void;
    clearOrder: () => void;
    counterMenu?: Counter[];
    counterPlate?: Counter[];
    setCounterPlate: React.Dispatch<React.SetStateAction<Counter[]>>;
    campaings?: Campaing[];
    setLastCounterPlate: React.Dispatch<React.SetStateAction<number | undefined>>;
    lastCounterPlate: number | undefined;
}

const OneMenuView = (props: OneMenuViewProps) => {
    const controller = useOneMenuView(props);

    const campaingBanner = (
        <Modal zIndex={101} closable={false} footer={null} title={null} visible={controller.visibleCampaingBanner}>
            <div className="w-full flex flex-col items-center justify-center space-y-5">
                <img className="w-full h-full" src={controller.campaing?.banner} />
                <div className="w-full flex items-center justify-center flex-row space-x-3">
                    <Button onClick={() => controller.setVisibleCampaingContent(true)} type="primary">
                        See Offer
                    </Button>
                    <Button onClick={() => controller.setVisibleCampaingBanner(false)} type="default">
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );

    const campaingContent = (
        <Modal zIndex={101} closable={false} footer={null} title={null} visible={controller.visibleCampaingContent}>
            <div className="w-full flex flex-col items-center justify-center space-y-5">
                <Image src={controller.campaing?.content} />
                <Button onClick={() => controller.setVisibleCampaingContent(false)} type="primary">
                    {' '}
                    Close{' '}
                </Button>
            </div>
        </Modal>
    );

    return (
        <section id="currentMenu" className="flex flex-col space-y-5">
            <Link
                to={`/restaurant/profile?id=${props.restaurant?.id}${
                    props.isWatchingRestaurant ? '&as_restaurant=true' : ''
                }`}
            >
                <div className="flex flex-row items-center space-x-1">
                    <IoIosArrowBack className="text-blue-500" />
                    <span className="hover:underline text-blue-500">Back</span>
                </div>
            </Link>
            <div>
                <h3 className="text-2xl">{props.currentMenu.name}</h3>
                <ul className="flex flex-row 400:justify-center flex-wrap justify-start gap-6">
                    {props.currentMenu.plates?.map((plate, index) => (
                        <PlatePublicCard
                            lastCounterPlate={props.lastCounterPlate}
                            setLastCounterPlate={props.setLastCounterPlate}
                            campaings={props.campaings}
                            counter={props.counterPlate}
                            setCounter={props.setCounterPlate}
                            key={index}
                            plate={plate}
                            order={props.order}
                            addPlateToOrder={props.addPlateToOrder}
                            clearOrder={props.clearOrder}
                        />
                    ))}
                </ul>
            </div>
            {campaingContent}
            {campaingBanner}
        </section>
    );
};

export default OneMenuView;
