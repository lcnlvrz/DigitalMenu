import React from 'react';
import { LogoProps } from '../../interfaces/Logo';
import { IoRestaurant } from 'react-icons/io5';

export const Logo = (props: LogoProps): JSX.Element => {
    return (
        <div className={'flex flex-col  items-center ' + props.containerClassName}>
            <IoRestaurant className={props.logoClassName} />
            <span className={props.textClassName}> DigitalMenu </span>
        </div>
    );
};
