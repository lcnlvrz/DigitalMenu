import { compose, createStore, Store } from 'redux';
import { authFetch } from '../fetch/auth.fetch';
import { RootStateReducer } from '../reducers/root-state.reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store: Store = createStore(RootStateReducer, composeEnhancers());

authFetch(store.dispatch);
