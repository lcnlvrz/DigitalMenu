import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../redux/reducers/root-state.reducer';

export const useOwnerNavigator = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const user = useSelector((state: RootState) => state.user);
    const restaurant = useSelector((state: RootState) => state.restaurant);
    const history = useHistory();

    return { currentPage, setCurrentPage, user, restaurant, history };
};
