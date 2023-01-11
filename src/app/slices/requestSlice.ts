import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { IrequestSlice, Irequest } from '../../Types/requestSliceTypes';

// /. imports

const initialState: IrequestSlice = {
    requests: [],
    currentRouteCoords: {
        lat_start: 51,
        lat_end: 19,
        lng_start: 0,
        lng_end: 0
    },
    isRequestsDataLoading: true,
    requestsFetchError: null
};

// /. state

const requestSlice = createSlice({
    name: 'requestSlice',
    initialState,
    reducers: {
        switchReqLoadingStatus(state, action: PayloadAction<boolean>) {
            state.isRequestsDataLoading = action.payload;
        },
        setRequestsData(state, action: PayloadAction<Irequest[]>) {
            state.requests = action.payload;
        },
        setReqError(state, action: PayloadAction<null | string>) {
            state.requestsFetchError = action.payload;
            state.isRequestsDataLoading = false;
        },
        setCurrentRouteCoords(state, action: PayloadAction<{ id: number }>) {
            const { id } = action.payload;
            // /. payload
            const targetRoute = state.requests.find(route => route.id === id);
            if (targetRoute) {
                state.currentRouteCoords.lat_start =
                    targetRoute.coords.lat_start;
                state.currentRouteCoords.lat_end = targetRoute.coords.lat_end;
                state.currentRouteCoords.lng_start =
                    targetRoute.coords.lng_start;
                state.currentRouteCoords.lng_end = targetRoute.coords.lng_end;
            }
        }
    }
});

export const {
    setRequestsData,
    switchReqLoadingStatus,
    setReqError,
    setCurrentRouteCoords
} = requestSlice.actions;

export default requestSlice.reducer;
