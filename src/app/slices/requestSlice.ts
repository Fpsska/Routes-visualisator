import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { IrequestSlice, Irequest } from '../../Types/requestSliceTypes';

// /. imports

const initialState: IrequestSlice = {
    requests: [],
    currentRouteData: {
        // latitude_start + longitude_start
        // latitude_end + longitude_end
        label: 'untitled',
        coords: {
            lat_start: 49.28594,
            lng_start: 42.11129,
            lat_end: 0,
            lng_end: 0
        }
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
                state.currentRouteData.coords.lat_start =
                    targetRoute.coords.lat_start;
                state.currentRouteData.coords.lat_end =
                    targetRoute.coords.lat_end;
                state.currentRouteData.coords.lng_start =
                    targetRoute.coords.lng_start;
                state.currentRouteData.coords.lng_end =
                    targetRoute.coords.lng_end;
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
