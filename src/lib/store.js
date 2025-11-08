import { configureStore } from '@reduxjs/toolkit';
import authApi from './features/auth/authApi';
import authentication from './features/authentication/authentication';
import authReducer from './features/auth/authSlice';
import categoryApi from './features/category/categoryApi';
import taskApi from './features/task/taskApi';
import serviceApi from './features/service/serviceApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [authentication.reducerPath]: authentication.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [taskApi.reducerPath]: taskApi.reducer,
      [serviceApi.reducerPath]: serviceApi.reducer
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      authApi.middleware, 
      authentication.middleware,
      categoryApi.middleware,
      taskApi.middleware,
      serviceApi.middleware
    ),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = makeStore();

export const getStoreState = () => store.getState();
export const getStoreDispatch = () => store.dispatch;

export default store;

