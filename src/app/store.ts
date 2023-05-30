import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import createSagaMiddleware from '@redux-saga/core';

import { rootWatcher } from 'app/sagas/rootSaga';

import requestSlice from 'app/slices/requestSlice';
import polylineSlice from 'app/slices/polylineSlice';

// /. imports

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { requestSlice, polylineSlice },
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
