import { configureStore } from '@reduxjs/toolkit';
import authApi from './features/auth/authApi';
import authentication from './features/authentication/authentication';
import authReducer from './features/auth/authSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [authentication.reducerPath]: authentication.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      authApi.middleware, 
      authentication.middleware
    ),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = makeStore();

export const getStoreState = () => store.getState();
export const getStoreDispatch = () => store.dispatch;

export default store;

