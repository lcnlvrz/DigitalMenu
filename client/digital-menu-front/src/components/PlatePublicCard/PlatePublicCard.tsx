import { Divider, Tooltip, InputNumber, Typography, Modal, Button, Image } from 'antd';
import React from 'react';
import { GrAddCircle } from 'react-icons/gr';
import { usePlatePublicCard } from '../../controllers/plate-public-card';
import { Counter, OrderExtended } from '../../controllers/restaurant-public-profile.controller';
import { PlateInterface } from '../../interfaces/Restaurant/restaurant.interface';
import { Campaing } from '../../services/campaing.service';

export interface PlatePublicCard {
    plate: PlateInterface;
    addPlateToOrder: (input: OrderExtended) => void;
    clearOrder: (input: number) => void;
    order: OrderExtended[];
    counter?: Counter[];
    setCounter: React.Dispatch<React.SetStateAction<Counter[]>>;
    campaings?: Campaing[];
    lastCounterPlate: number | undefined;
    setLastCounterPlate: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const PlatePublicCard = (props: PlatePublicCard) => {
    const controller = usePlatePublicCard(props);

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

    const productModal = (
        <Modal zIndex={100} footer={null} onCancel={controller.handleOpen} visible={controller.isOpenModal}>
            <img src={props.plate.image} className="w-full h-72 object-contain" />
            <section className="flex flex-col w-full">
                <div className="w-full flex flex-row items-start">
                    <div className="w-3/4 text-left">
                        <h2 className="text-2xl m-0"> {props.plate.title} </h2>
                        <p className="text-gray-400"> {props.plate.description} </p>
                    </div>
                    <h2 className="w-1/4 text-right font-normal text-2xl"> ${props.plate.price} </h2>
                </div>
                <Divider style={{ margin: '15px 0px' }} />
                <div>
                    <h2 className="text-lg"> Ingredients </h2>
                    <p>
                        {' '}
                        {props.plate.ingredients.map((ingredient, index) => {
                            if (props.plate.ingredients.length === index + 1) return ingredient;
                            return ingredient + ', ';
                        })}{' '}
                    </p>
                    <Divider style={{ margin: '15px 0px' }} />
                    <h2 className="text-lg"> Preparation Time </h2>
                    <p>{props.plate.preparationTime} minutes</p>
                    <Divider style={{ margin: '15px 0px' }} />
                    <h2 className="text-lg"> Weight </h2>
                    <p>{props.plate.weight} cal</p>
                    <Divider style={{ margin: '15px 0px' }} />
                    <section className="w-full flex justify-between flex-row items-end">
                        <div>
                            <h2 className="text-lg"> Quantity </h2>
                            <InputNumber
                                onChange={(value) =>
                                    controller.setOrderExtended((prevState) => ({
                                        ...prevState,
                                        quantity: value,
                                    }))
                                }
                                value={controller.orderExtended.quantity}
                                defaultValue={1}
                                min={1}
                                max={10}
                            />
                        </div>
                        <button
                            onClick={controller.addPlateToOrder}
                            className="bg-blue-500 w-2/4 p-2 text-white border-2xl hover:bg-blue-800 transition-all font-semibold"
                        >
                            Add to cart (${props.plate.price})
                        </button>
                    </section>
                </div>
            </section>
        </Modal>
    );

    return (
        <section>
            <div
                style={{ height: '22rem', zIndex: 1000 }}
                onClick={controller.onClickCard}
                className="w-40 flex flex-col space-y-2 cursor-pointer plate-card"
            >
                <div>
                    <img className="w-56 400:w-full h-40 object-contain object-center" src={props.plate.image} />
                    <div>
                        <Typography.Paragraph ellipsis={{ rows: 2 }} className="text-base">
                            {props.plate.title}
                        </Typography.Paragraph>
                        <Typography.Paragraph
                            ellipsis={{ rows: 3 }}
                            className=" text-sm text-strong-hover transition-all"
                        >
                            {props.plate.description}
                        </Typography.Paragraph>
                    </div>
                </div>
                <div className="flex flex-row space-x-2 items-center 400:text-center 400:items-center 400:jusfity-center">
                    <Typography.Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0 }} className="text-base m-0">
                        {' '}
                        ${props.plate.price} USD{' '}
                    </Typography.Paragraph>
                    <Tooltip title="Add to cart!">
                        <GrAddCircle className="text-lg z-10 hover:bg-red-500 hover:text-white rounded-full transition-all icon-fill-hover" />
                    </Tooltip>
                </div>
            </div>
            {campaingBanner}
            {campaingContent}
            {productModal}
        </section>
    );
};

export default PlatePublicCard;
