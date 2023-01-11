import { all } from 'redux-saga/effects';

import { fetchRequestsWatcher } from './requestSaga';

// /. imports

export function* rootWatcher(): any {
    yield all([fetchRequestsWatcher()]);
}
