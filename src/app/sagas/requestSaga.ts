import { call, put, takeEvery } from 'redux-saga/effects';

import { fetchRequestsData } from '../api/fetchRequestsData';
import {
    setRequestsData,
    switchReqLoadingStatus
} from '../slices/requestSlice';

// /. imports

function* fetchRequestsWorker(): any {
    const requestsData = yield call(fetchRequestsData);
    yield put(setRequestsData(requestsData));
}

export function* fetchRequestsWatcher(): any {
    yield takeEvery(switchReqLoadingStatus.type, fetchRequestsWorker);
}
