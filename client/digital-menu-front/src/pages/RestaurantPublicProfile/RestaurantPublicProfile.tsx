import React from 'react';
import { ArrowLeftOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Fragment } from 'react';
import { ConfirmOrder, useRestaurantPublicProfile } from '../../controllers/restaurant-public-profile.controller';
import {
    Divider,
    Rate,
    Spin,
    Tabs,
    Dropdown,
    Typography,
    Input as InputAntd,
    Tooltip,
    Button,
    Image,
    Affix,
    InputNumber as InputNumberAntd,
    Radio as RadioAntd,
} from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { BiRestaurant } from 'react-icons/bi';
import PlatePublicCard from '../../components/PlatePublicCard/PlatePublicCard';
import { IoTrashOutline } from 'react-icons/io5';
import { MdCancel } from 'react-icons/md';
import Modal from 'antd/lib/modal/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { IoLocationSharp } from 'react-icons/io5';
import { Formik } from 'formik';
import { ConfirmOrderSchema } from '../../schema/ConfirmOrder/ConfirmOrder.schema';
import { Input, Form, SubmitButton, Radio, Select } from 'formik-antd';
import { PaymentMethod } from '../../services/order.service';
import moment from 'moment';
import './RestaurantPublicProfile.css';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import OneMenuView from '../../components/OneMenuView/OneMenuView';
import { FaDoorClosed } from 'react-icons/fa';

const { TabPane } = Tabs;

export const RestaurantPublicProfile = () => {
    const controller = useRestaurantPublicProfile();

    const profile = (
        <div className="h-32 w-full relative bg-black">
            <section className="cursor-pointer hover:ring absolute w-full text-white space-x-2 p-5 h-full z-10 top-0 bottom-0 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center space-x-2">
                    <Avatar
                        shape="square"
                        className="avatar-profile"
                        src={
                            controller?.restaurant?.profilePhoto ||
                            'https://i2.wp.com/news.microsoft.com/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1'
                        }
                    />
                    <div className="flex flex-col space-y-0">
                        <Typography.Paragraph
                            ellipsis={{ rows: 1 }}
                            style={{ color: 'white', fontSize: '1.125rem', margin: 0, fontWeight: 500 }}
                        >
                            {' '}
                            {controller?.restaurant?.name}{' '}
                        </Typography.Paragraph>
                        <Typography.Paragraph
                            ellipsis={{ rows: 1 }}
                            style={{ margin: 0, color: 'white' }}
                            className="m-0"
                        >
                            {' '}
                            {controller?.restaurant?.location}{' '}
                        </Typography.Paragraph>
                        <div className="flex flex-row space-x-1 items-center">
                            <Rate
                                className="rate-restaurant"
                                defaultValue={controller.rateCalculated}
                                disabled={true}
                            />
                            <span className="500:text-xs">{controller.rateCalculated}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    {(() => {
                        if (controller.restaurant?.isDayMatched) {
                            if (controller.restaurant?.closesAt) {
                                return (
                                    <>
                                        <h2 className="text-green-400 text-5xl m-0 500:text-2xl text-center">Open</h2>
                                        <h2 className="text-red-400 text-lg text-center 400:hidden">
                                            {' '}
                                            Closes at {controller.restaurant?.closesAt}
                                        </h2>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <h2 className="text-red-400 text-3xl m-0 500:text-2xl text-center">Closed</h2>
                                        <h2 className="text-green-400 text-lg text-center 400:hidden">
                                            {' '}
                                            Opens at {controller.restaurant?.opensAt}
                                        </h2>
                                    </>
                                );
                            }
                        } else {
                            return (
                                <>
                                    <h2 className="text-red-400 text-3xl m-0 500:text-sm text-center ">Closed Today</h2>
                                    <h2 className="text-white text-sm 500:text-sm text-center 400:hidden">
                                        See you{' '}
                                        {controller.restaurant?.nextNearDay
                                            ? 'on ' + controller.restaurant?.nextNearDay
                                            : 'next week'}
                                    </h2>
                                </>
                            );
                        }
                    })()}
                </div>
            </section>
            <img
                className="w-full h-full object-cover object-center opacity-50 hover:opacity-5"
                src={
                    controller?.restaurant?.bannerPhoto ||
                    'https://josephliu.co/wp-content/uploads/2019/06/10-ferdinand-stohr-149422-unsplash.jpg'
                }
            />
        </div>
    );

    const order = (
        <div className=" border-dashed border space-y-5 p-2 border-gray-300 mt-5">
            <div className="w-full flex flex-row justify-between">
                <h1 className="text-lg"> Your order </h1>
                {controller.order.length ? (
                    <Tooltip title="Cancel">
                        <IoTrashOutline
                            onClick={controller.clearOrder}
                            className="text-gray-500 hover:text-black transition-all cursor-pointer text-2xl"
                        />
                    </Tooltip>
                ) : null}
            </div>
            <div className="w-full text-center flex items-start flex-col space-y-3">
                {!controller.order.length ? (
                    <div className="w-full text-center flex flex-col items-center">
                        <BiRestaurant className="text-7xl" />
                        <h3 className="m-0"> Are you hungry? </h3>
                        <p className="m-0 text-xs"> Your order is empty </p>
                    </div>
                ) : (
                    controller.order.map((plate, index) => {
                        const orderPlateDetails = (
                            <section className="bg-white p-4 shadow-lg">
                                <h3> {plate.title} </h3>
                                <p className="text-xs text-gray-400"> {plate.description} </p>
                            </section>
                        );

                        return (
                            <Dropdown
                                onVisibleChange={(_) => controller.handleVisibleMenu(plate.id)}
                                visible={plate.isHover}
                                placement="topRight"
                                arrow
                                key={index}
                                overlay={orderPlateDetails}
                            >
                                <div className="flex flex-row justify-between items-center cursor-pointer w-full hover:bg-gray-100 transition-all hover-parent">
                                    <InputNumberAntd
                                        onChange={(value) =>
                                            controller.updatePlateFromOrder(plate.id, { quantity: value })
                                        }
                                        min={1}
                                        value={plate.quantity}
                                    />
                                    <Typography.Paragraph
                                        style={{ color: '#60A5FA', margin: 0 }}
                                        ellipsis={{ rows: 1 }}
                                    >
                                        {' '}
                                        {plate.title}
                                    </Typography.Paragraph>
                                    <Tooltip title="Remove" className="show-on-hover">
                                        <MdCancel
                                            onClick={(_) => controller.removePlateFromOrder(plate.id)}
                                            className="text-lg text-red-500  transition-all"
                                        />
                                    </Tooltip>
                                    <Typography.Paragraph
                                        style={{ margin: 0 }}
                                        className="hover-children-dissapear transition-all"
                                        ellipsis={{ rows: 1 }}
                                    >
                                        {' '}
                                        ${plate.price}{' '}
                                    </Typography.Paragraph>
                                </div>
                            </Dropdown>
                        );
                    })
                )}
            </div>
            {controller.order.length ? (
                <div className="flex flex-col space-y-5">
                    <InputAntd.TextArea
                        onChange={(e) => controller.setClarificationsAboutOrder(e.target.value)}
                        value={controller.clarificationsAboutOrder}
                        autoSize={{ minRows: 2, maxRows: 2 }}
                        placeholder="Clarifications to the restaurant"
                        name="clarifications"
                    />
                    <div className="flex flex-row justify-between">
                        <h3 className="text-lg"> Total </h3>
                        <p className="font-semibold text-lg">
                            $
                            {controller.order.length
                                ? controller.order
                                      .map((plate) => plate.price * plate.quantity)
                                      .reduce((prev, current) => {
                                          return prev + current;
                                      }, 0)
                                : null}
                        </p>
                    </div>
                </div>
            ) : null}
            <Button
                disabled={!controller.order.length}
                onClick={controller.handleOpen}
                type="primary"
                className="bg-blue-500  text-white  w-full hover:bg-blue-800 transition-all"
            >
                {' '}
                Continue{' '}
            </Button>
        </div>
    );

    const confirmOrder = (
        <Modal
            closable={false}
            destroyOnClose
            footer={null}
            title={
                <Fragment>
                    <div className="flex items-center flex-row space-x-3">
                        {controller.stepsConfirmOrder !== 'first' && (
                            <button
                                className="focus:outline-none active:outline-none"
                                onClick={() => {
                                    if (controller.stepsConfirmOrder === 'second') {
                                        controller.setStepsConfirmOrder('first');
                                    } else if (controller.stepsConfirmOrder === 'thrid') {
                                        controller.setStepsConfirmOrder('second');
                                    }
                                }}
                            >
                                <ArrowLeftOutlined />
                            </button>
                        )}

                        <h2 className="m-0">Confirm Order</h2>
                    </div>
                </Fragment>
            }
            visible={controller.visibleConfirmOrder}
        >
            <Formik
                validateOnMount={true}
                onSubmit={(values) => {
                    controller.createOrder(values);
                }}
                validationSchema={ConfirmOrderSchema}
                initialValues={
                    {
                        firstName: '',
                        lastName: '',
                        paymentMethod: PaymentMethod.EFFECTIVE,
                    } as ConfirmOrder
                }
            >
                {({ isValid, errors }) => {
                    const confirmOrderFirstStep = (
                        <Fragment>
                            <Form.Item name="firstName" label="First Name:" required>
                                <Input name="firstName" />
                            </Form.Item>
                            <Form.Item label="Last Name:" name="lastName" required>
                                <Input name="lastName" />
                            </Form.Item>
                            {controller.restaurant?.hasOtherPaymentMethod && (
                                <Form.Item label="Payment Method:" required name="paymentMethod">
                                    <Radio.Group optionType="button" name="paymentMethod" buttonStyle="solid">
                                        <Radio.Button value={PaymentMethod.EFFECTIVE}>Effective</Radio.Button>
                                        <Radio.Button value={PaymentMethod.OTHER_METHOD}>Other Payment</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                            <div className="flex flex-row space-x-3">
                                <Button
                                    onClick={() => controller.setStepsConfirmOrder('second')}
                                    disabled={errors.firstName || errors.lastName ? true : false}
                                    type="primary"
                                >
                                    Continue
                                </Button>
                                <Button onClick={() => controller.handleOpen()} type="default">
                                    {' '}
                                    Cancel{' '}
                                </Button>
                            </div>
                        </Fragment>
                    );

                    const confirmOrderSecondStep = (
                        <div className="w-full flex flex-col text-center items-center">
                            <h1 className="text-3xl text-blue-500"> We&apos;r almost there! </h1>
                            <p className="font-semibold text-gray-500">
                                {' '}
                                For security risks, call some employee of the restaurant to type the security password
                                for create the order{' '}
                            </p>
                            <Button onClick={() => controller.setStepsConfirmOrder('thrid')} type="primary">
                                Authenticate
                            </Button>
                        </div>
                    );

                    const confirmOrderThirdStep = (
                        <Fragment>
                            <Form.Item label="Table:" required name="tableId">
                                <Select
                                    notFoundContent="The aren't any tables created"
                                    placeholder="Select one table"
                                    options={
                                        controller.restaurant?.tables?.length
                                            ? controller.restaurant.tables.map((table, index) => ({
                                                  label: table.name,
                                                  value: table.id,
                                                  key: index,
                                              }))
                                            : undefined
                                    }
                                    name="tableId"
                                />
                            </Form.Item>
                            <Form.Item required label="Security Password:" name="securityPassword">
                                <Input.Password name="securityPassword" />
                            </Form.Item>
                            <div className="flex flex-row space-x-3">
                                <SubmitButton loading={controller.isLoading} disabled={!isValid} type="primary">
                                    Create Order
                                </SubmitButton>
                                <Button
                                    disabled={controller.isLoading}
                                    onClick={() => controller.handleOpen()}
                                    type="default"
                                >
                                    {' '}
                                    Cancel{' '}
                                </Button>
                            </div>
                        </Fragment>
                    );

                    switch (controller.stepsConfirmOrder) {
                        case 'first':
                            return <Form layout="vertical">{confirmOrderFirstStep}</Form>;

                        case 'second':
                            return <Form layout="vertical">{confirmOrderSecondStep}</Form>;

                        default:
                        case 'second':
                            return <Form layout="vertical">{confirmOrderThirdStep}</Form>;
                    }
                }}
            </Formik>
        </Modal>
    );

    if (controller.isLoadingRestaurant) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    } else if (!controller.restaurant) {
        return (
            <div className="h-screen flex items-center flex-col justify-center">
                <FaDoorClosed className="text-9xl" />
                <h1 className="text-2xl">This restaurant doesn&apos;t exist</h1>
                <Link to="/">
                    <Button type="primary">Back Home</Button>
                </Link>
            </div>
        );
    }

    const campaingBanner = (
        <Modal closable={false} footer={null} title={null} visible={controller.currentCampaing?.bannerVisible}>
            <div className="w-full flex flex-col items-center justify-center space-y-5">
                <img className="w-full h-full" src={controller.currentCampaing.campaing?.banner} />
                <div className="w-full flex items-center justify-center flex-row space-x-3">
                    <Button
                        onClick={() =>
                            controller.setCurrentCampaing((prevState) => ({ ...prevState, contentVisible: true }))
                        }
                        type="primary"
                    >
                        See Offer
                    </Button>
                    <Button
                        onClick={() =>
                            controller.setCurrentCampaing({
                                bannerVisible: undefined,
                                contentVisible: undefined,
                                campaing: undefined,
                            })
                        }
                        type="default"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );

    const campaingContent = (
        <Modal closable={false} footer={null} title={null} visible={controller.currentCampaing?.contentVisible}>
            <div className="w-full flex flex-col items-center justify-center space-y-5">
                <Image src={controller.currentCampaing.campaing?.content} />
                <Button
                    onClick={() =>
                        controller.setCurrentCampaing((prevState) => ({ ...prevState, contentVisible: false }))
                    }
                    type="primary"
                >
                    {' '}
                    Close{' '}
                </Button>
            </div>
        </Modal>
    );

    return (
        <main className="w-full flex flex-col items-center justify-center">
            {profile}
            <div className="w-full p-5">
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<h3 className="m-0"> Menus </h3>} key="1">
                        <section className="w-full flex flex-row items-start h-full space-x-5">
                            <div className="w-3/5 800:w-full">
                                {(() => {
                                    if (controller.currentMenu) {
                                        return (
                                            <OneMenuView
                                                lastCounterPlate={controller.lastCounterPlate}
                                                setLastCounterPlate={controller.setLastCounterPlate}
                                                campaings={controller.restaurant?.campaings}
                                                counterMenu={controller.counterMenu}
                                                setCounterPlate={controller.setCounterPlate}
                                                counterPlate={controller.counterPlate}
                                                restaurant={controller.restaurant}
                                                order={controller.order}
                                                isWatchingRestaurant={controller.isWatchingRestaurant}
                                                currentMenu={controller.currentMenu}
                                                clearOrder={controller.clearOrder}
                                                addPlateToOrder={controller.addPlateToOrder}
                                            />
                                        );
                                    } else if (controller.restaurant?.menus?.length) {
                                        return controller.restaurant?.menus?.map((menu, index) => {
                                            const menuJSX = (
                                                <Fragment key={index}>
                                                    <div className="w-full mb-3 flex flex-row justify-between items-center">
                                                        <h2 className="text-lg m-0">{menu?.name}</h2>
                                                        <div className="flex flex-row space-x-1 items-center">
                                                            <Link
                                                                onClick={() => {
                                                                    const indexMenuInCounter = controller.counterMenu.findIndex(
                                                                        (counter) => counter.id === menu.id,
                                                                    );
                                                                    const newState = [...controller.counterMenu];
                                                                    if (indexMenuInCounter !== -1) {
                                                                        newState[indexMenuInCounter].count =
                                                                            newState[indexMenuInCounter].count + 1;
                                                                        controller.setCounterMenu(newState);
                                                                    } else {
                                                                        newState.push({ count: 1, id: menu.id });
                                                                        controller.setCounterMenu(newState);
                                                                    }
                                                                }}
                                                                to={`/restaurant/profile?id=${
                                                                    controller.restaurant?.id
                                                                }${
                                                                    controller.isWatchingRestaurant
                                                                        ? '&as_restaurant=true'
                                                                        : ''
                                                                }&menu_id=${menu.id}`}
                                                            >
                                                                <span className="hover:underline transition-all text-blue-500 cursor-pointer">
                                                                    See More
                                                                </span>
                                                            </Link>
                                                            <IoIosArrowForward className="text-blue-500" />
                                                        </div>
                                                    </div>
                                                    <Divider style={{ marginTop: 0, marginBottom: '1rem' }} />
                                                    <Swiper
                                                        navigation
                                                        breakpoints={{
                                                            400: {
                                                                slidesPerView: 2,
                                                                centerInsufficientSlides: true,
                                                            },
                                                            550: {
                                                                slidesPerView: 3,
                                                                centerInsufficientSlides: true,
                                                            },
                                                            800: {
                                                                slidesPerView: 3,
                                                                spaceBetween: 50,
                                                                centerInsufficientSlides: true,
                                                            },
                                                        }}
                                                    >
                                                        {menu.plates?.length ? (
                                                            menu.plates.map((plate, index) => (
                                                                <SwiperSlide
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                    key={index}
                                                                >
                                                                    <PlatePublicCard
                                                                        setLastCounterPlate={
                                                                            controller.setLastCounterPlate
                                                                        }
                                                                        lastCounterPlate={controller.lastCounterPlate}
                                                                        campaings={controller.restaurant?.campaings}
                                                                        counter={controller.counterPlate}
                                                                        setCounter={controller.setCounterPlate}
                                                                        plate={plate}
                                                                        order={controller.order}
                                                                        addPlateToOrder={controller.addPlateToOrder}
                                                                        clearOrder={controller.clearOrder}
                                                                    />
                                                                </SwiperSlide>
                                                            ))
                                                        ) : (
                                                            <p>This menu doesn&apos;t have any plates yet</p>
                                                        )}
                                                    </Swiper>
                                                </Fragment>
                                            );

                                            if (
                                                menu.id === controller.isLoadingMenu.id &&
                                                controller.isLoadingMenu.isLoading
                                            ) {
                                                return (
                                                    <div
                                                        style={{ height: '523px' }}
                                                        key={index}
                                                        className="flex w-full items-center justify-center"
                                                    >
                                                        <Spin />
                                                    </div>
                                                );
                                            }
                                            return (
                                                <Fragment key={index}>
                                                    {menuJSX}
                                                    {controller.restaurant?.menus?.length !== index + 1 && (
                                                        <Divider style={{ opacity: 0 }} />
                                                    )}
                                                </Fragment>
                                            );
                                        });
                                    } else {
                                        return (
                                            <div>
                                                <h1>This restaurant doesn&apos;t have any menu</h1>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                            <div style={{ width: '40%' }} className="800:hidden">
                                <Affix style={{ width: '100%' }}>{order}</Affix>
                            </div>
                        </section>
                    </TabPane>
                    <TabPane
                        className="flex flex-col space-y-5 items-start"
                        tab={<h3 className="m-0"> Information </h3>}
                        key="2"
                    >
                        <div className="w-2/4 600:w-full">
                            <h2 className="text-lg">Schedule</h2>
                            <ul>
                                {controller.restaurant?.schedule?.map((day, index) => (
                                    <Fragment key={index}>
                                        <li className="w-full flex flex-row justify-between">
                                            <p className="m-0 font-semibold text-gray-500">{day.day}</p>
                                            <p className="m-0">
                                                {day.hour[0]} - {day.hour[1]}
                                            </p>
                                        </li>
                                        {index + 1 !== controller.restaurant?.schedule?.length && (
                                            <Divider style={{ margin: '10px 0' }} />
                                        )}
                                    </Fragment>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-lg"> Location </h2>
                            <div className="flex flex-row items-center space-x-1">
                                <IoLocationSharp className="text-red-500" />
                                <p className="m-0 font-semibold text-gray-500">{controller.restaurant?.location}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg"> Cellphone </h2>
                            <div className="flex flex-row items-center space-x-1">
                                <PhoneOutlined style={{ color: '#3B82F6' }} />
                                <p className="m-0 font-semibold text-gray-500">{controller.restaurant?.cellphone}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg"> Delivery </h2>
                            <div className="flex flex-row items-center space-x-1">
                                <RadioAntd.Group value={controller.restaurant?.isDelivery ? 'Yes' : 'No'}>
                                    <RadioAntd value="Yes"> Yes </RadioAntd>
                                    <RadioAntd value="No"> No </RadioAntd>
                                </RadioAntd.Group>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <h3 className="m-0"> Reviews ({controller.restaurant?.reviewsSurveyForm?.length || 0}) </h3>
                        }
                        key="3"
                    >
                        {controller.restaurant?.reviewsSurveyForm?.length ? (
                            <ul>
                                {controller.restaurant.reviewsSurveyForm.map((review, index) => (
                                    <Fragment key={index}>
                                        <div className="flex flex-col space-y-5">
                                            <p className="font-semibold m-0"> Q: {review.question}</p>
                                            <li key={index} className="flex flex-row items-center space-x-3">
                                                <UserOutlined className="text-lg" />
                                                <div className="flex flex-col">
                                                    <p className="m-0">{review.name}</p>
                                                    <div className="flex flex-row space-x-3 items-center">
                                                        <Rate value={review.value} disabled />
                                                        <span>{review.value}</span>
                                                    </div>
                                                    <p className="m-0">{moment(review.createdAt).fromNow()}</p>
                                                </div>
                                            </li>
                                        </div>
                                        {index + 1 !== controller.restaurant?.reviewsSurveyForm?.length && (
                                            <Divider style={{ margin: '2rem 0px' }} />
                                        )}
                                    </Fragment>
                                ))}
                            </ul>
                        ) : (
                            <h2>This restaurant doesn&apos;t have any reviews yet</h2>
                        )}
                    </TabPane>
                    {controller.isBreakpoint && (
                        <TabPane
                            className="cart-panel"
                            tab={<h3 className="m-0"> Cart Order ({controller.order.length}) </h3>}
                            key="4"
                        >
                            {order}
                        </TabPane>
                    )}
                </Tabs>
                {confirmOrder}
            </div>
            {controller.isWatchingRestaurant && (
                <footer className="sticky-bottom-footer z-10">
                    <Link to="/dashboard">
                        <button className="bg-red-500 py-1 px-3 m-2 hover:bg-red-800 transition-all text-white font-semibold rounded">
                            Back to Dashboard
                        </button>
                    </Link>
                </footer>
            )}
            {campaingBanner}
            {campaingContent}
        </main>
    );
};
