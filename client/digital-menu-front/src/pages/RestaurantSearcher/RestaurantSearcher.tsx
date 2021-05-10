import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Input, Rate } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Link } from 'react-router-dom';
import { useRestaurantSearcher } from '../../controllers/restaurant-searcher.controller';

export const RestaurantSearcher = () => {
    const controller = useRestaurantSearcher();

    return (
        <div className="bg-gray-800 h-screen flex items-center justify-center flex-col">
            <h1 className="text-white text-4xl text-center"> Search some Restaurant </h1>
            <Input.Search
                loading={controller.isLoading}
                onChange={(e) => controller.setQueryValue(e.target.value)}
                placeholder="Mcdonalds, Burguer King..."
                style={{ width: '75%' }}
            />
            <ul className="w-full flex flex-col items-center justify-center">
                {controller.restaurants.length &&
                    controller.restaurants.map((restaurant, index) => (
                        <li className="h-32 w-3/4 relative bg-black" key={index}>
                            <Link to={'/restaurant?id=' + restaurant.id}>
                                <section className="cursor-pointer hover:ring absolute w-full text-white space-x-2 p-5 h-full z-10 top-0 bottom-0 flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center space-x-2">
                                        <Avatar
                                            style={{ width: '5rem', height: '5rem' }}
                                            shape="square"
                                            src={restaurant.profilePhoto}
                                        />
                                        <div className="flex flex-col space-y-0">
                                            <h2 className="text-white text-lg m-0"> {restaurant.name} </h2>
                                            <span className="m-0"> {restaurant.location} </span>
                                            <div className="flex flex-row space-x-2 items-end">
                                                <Rate defaultValue={4.5} />
                                                <span> 4.5 </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <ClockCircleOutlined className="text-2xl" />
                                        {restaurant.isDayMatched ? (
                                            <h3 className="text-white text-2xl font-semibold">
                                                <span className="text-green-300">Open</span> until{' '}
                                            </h3>
                                        ) : (
                                            <h3 className="text-white text-2xl font-semibold">
                                                {' '}
                                                <span className="text-red-400">Closed</span> until{' '}
                                            </h3>
                                        )}
                                    </div>
                                </section>
                                <img
                                    className="w-full h-full object-cover object-center opacity-30"
                                    src={restaurant.bannerPhoto}
                                />
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
