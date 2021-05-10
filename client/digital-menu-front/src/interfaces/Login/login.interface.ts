import { LoginInitialValue } from '../../initial-values/Login/login.initial-value';

export interface UseLoginInterface {
    isLoading: boolean;
    login: (input: typeof LoginInitialValue) => void;
}
