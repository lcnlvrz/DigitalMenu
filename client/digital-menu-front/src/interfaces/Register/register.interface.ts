import { RegisterInitialValue } from '../../initial-values/Register';
import { UserInterface, UserRoles } from '../User';

export interface UseRegisterInterface {
    register: (input: RegisterInterface) => void;
    isLoading: boolean;
}

export interface RegisterOutputDto {
    accessToken: string;
    user: UserInterface;
}

export interface RegisterInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRoles[];
}
