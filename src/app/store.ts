import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import createSagaMiddleware from '@redux-saga/core';

import requestSlice from './slices/requestSlice';

import { fetchRequestsWatcher } from './sagas/requestSaga';

// /. imports

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { requestSlice },
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(fetchRequestsWatcher);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
