import { call, put, takeEvery, select } from 'redux-saga/effects';

import { fetchPolylineData } from '../api/fetchPolylineData';

import { setPolylineData, triggerPolylineFetch } from '../slices/polylineSlice';

// /. imports

interface Iargs {
    lng_start: number;
    lat_start: number;
    lng_end: number;
    lat_end: number;
}

// /. interfaces

function* fetchPolylineWorker(): any {
    // business logic
    const { currentRoutesData } = yield select(state => state.requestSlice);

    const args: Iargs = yield {
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
    yield takeEvery(triggerPolylineFetch.type, fetchPolylineWorker);
}
