export enum UserRoles {
    OWNER = 'OWNER',
    CUSTOMER = 'CUSTOMER',
}

export interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
    role: UserRoles[];
    isLogged: boolean;
}

export interface UserLoading {
    isLoading: boolean;
}

export type UserReducerInterface = Partial<UserInterface> & UserLoading;

export enum UserActionsTypes {
    SET_USER = 'SET_USER',
    CLEAR_USER = 'CLEAR_USER',
    UPDATE_USER = 'UPDATE_USER',
}

export interface AccessToken {
    accessToken: string;
}

export type UserActions =
    | { type: UserActionsTypes.SET_USER; payload: UserInterface }
    | { type: UserActionsTypes.CLEAR_USER }
    | { type: UserActionsTypes.UPDATE_USER; payload: UserInterface };
