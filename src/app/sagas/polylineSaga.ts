import { call, put, takeEvery, select } from 'redux-saga/effects';

import { fetchPolylineData } from '../api/fetchPolylineData';

import {
    setPolylineData,
    switchPolyLoadingStatus
} from '../slices/polylineSlice';

// /. imports

function* fetchPolylineWorker(): any {
    // business logic
    const { currentRoutesData } = yield select(state => state.requestSlice);

    const args = {
        lng_start: currentRoutesData[0].coords.lng,
        lat_start: currentRoutesData[0].coords.lat,
        lng_end: currentRoutesData[1].coords.lng,
        lat_end: currentRoutesData[1].coords.lat
    };

    const polylineData = yield call(fetchPolylineData, { ...args });
    yield put(setPolylineData(polylineData));
}

export function* fetchPolylineWatcher(): any {
    // watching for AC of slice
    yield takeEvery(switchPolyLoadingStatus.type, fetchPolylineWorker);
}
