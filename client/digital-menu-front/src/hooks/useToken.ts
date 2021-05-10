import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { TokenHelper } from '../helpers/token.helper';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions } from '../redux/reducers/root-state.reducer';

export const useToken = () => {
    const dispatch: Dispatch<AllActions> = useDispatch();

    const tokenHelper = new TokenHelper();

    const execute = (): string | undefined => {
        const token = tokenHelper.get();
        if (!token) {
            dispatch({ type: UserActionsTypes.CLEAR_USER });
            return;
        }
        return token;
    };

    return { execute, tokenHelper };
};
