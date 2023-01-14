import { all } from 'redux-saga/effects';

import { fetchRequestsWatcher } from './requestSaga';
import { fetchPolylineWatcher } from './polylineSaga';

// /. imports

export function* rootWatcher(): any {
    yield all([fetchRequestsWatcher(), fetchPolylineWatcher()]);
}
