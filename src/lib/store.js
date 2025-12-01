import { configureStore } from '@reduxjs/toolkit';
import authApi from './features/auth/authApi';
import authentication from './features/authentication/authentication';
import authReducer from './features/auth/authSlice';
import categoryApi from './features/category/categoryApi';
import taskApi from './features/task/taskApi';
import serviceApi from './features/service/serviceApi';
import bidApi from './features/bidApi/bidApi';
import questionApi from './features/question/questionApi';
import cancellationApi from './features/cancelApi/cancellationApi';
import providerServiceApi from './features/providerService/providerServiceApi';
import { chatApi } from './features/chatApi/chatApi';
import extensionApi from './features/extensionApi/extensionApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [authentication.reducerPath]: authentication.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [taskApi.reducerPath]: taskApi.reducer,
      [serviceApi.reducerPath]: serviceApi.reducer,
      [bidApi.reducerPath]: bidApi.reducer,
      [questionApi.reducerPath]: questionApi.reducer,
      [cancellationApi.reducerPath]: cancellationApi.reducer,
      [providerServiceApi.reducerPath]: providerServiceApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [extensionApi.reducerPath]: extensionApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      authApi.middleware, 
      authentication.middleware,
      categoryApi.middleware,
      taskApi.middleware,
      serviceApi.middleware,
      bidApi.middleware,
      questionApi.middleware,
      cancellationApi.middleware,
      providerServiceApi.middleware,
      chatApi.middleware,
      extensionApi.middleware
    ),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = makeStore();

export const getStoreState = () => store.getState();
export const getStoreDispatch = () => store.dispatch;

export default store;

