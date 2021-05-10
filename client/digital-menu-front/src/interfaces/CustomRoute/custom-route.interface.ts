import { RouteComponentProps } from 'react-router';
import { UserRoles } from '../User';

export interface CustomRouteInterface {
    role: UserRoles[];
    path: string;
    exact: boolean;
    component: (props: RouteComponentProps) => JSX.Element;
}
