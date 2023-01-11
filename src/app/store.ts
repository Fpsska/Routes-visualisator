import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import createSagaMiddleware from '@redux-saga/core';

import requestSlice from './slices/requestSlice';

import { rootWatcher } from './sagas/rootSaga';

// /. imports

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { requestSlice },
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(rootWatcher);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
