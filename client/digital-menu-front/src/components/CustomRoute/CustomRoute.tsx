import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { CustomRouteInterface } from '../../interfaces/CustomRoute/custom-route.interface';
import { UserRoles } from '../../interfaces/User';
import { RootState } from '../../redux/reducers/root-state.reducer';

export const CustomRoute = (props: CustomRouteInterface): JSX.Element => {
    const [returnedRoutes, setReturnedRoutes] = useState<
        React.ReactElement<Route<RouteComponentProps>> | React.ReactElement<Redirect> | null
    >(null);

    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!user.isLoading && user.role) {
            switch (props.role[0]) {
                case UserRoles.OWNER:
                    if (user.role[0] === UserRoles.OWNER) {
                        return setReturnedRoutes(<Route {...props} />);
                    } else {
                        return setReturnedRoutes(<Redirect to="/login" />);
                    }

                default:
                    if (user.role[0] === UserRoles.OWNER) {
                        return setReturnedRoutes(<Redirect to="/" />);
                    } else {
                        return setReturnedRoutes(<Route {...props} />);
                    }
            }
        }
    }, [user, props]);

    return <>{returnedRoutes}</>;
};
