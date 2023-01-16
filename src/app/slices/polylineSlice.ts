import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

// /. imports

interface IpolylineSlice {
    polylineData: any;
    isPolylineDataLoading: boolean;
    polylineFetchError: null | string;
}

// /. interfaces

const initialState: IpolylineSlice = {
    polylineData: null,
    isPolylineDataLoading: false,
    polylineFetchError: null
};

// /. state

const polylineSlice = createSlice({
    name: 'polylineSlice',
    initialState,
    reducers: {
        switchPolyLoadingStatus(state, action: PayloadAction<boolean>) {
            state.isPolylineDataLoading = action.payload;
        },
        setPolylineData(state, action: PayloadAction<any>) {
            state.polylineData = action.payload;
            console.log(action.payload);
        },
        setPolyError(state, action: PayloadAction<null | string>) {
            state.polylineFetchError = action.payload;
            state.isPolylineDataLoading = false;
        },
        triggerPolylineFetch() {
            return;
        }
    }
});

export const {
    switchPolyLoadingStatus,
    setPolylineData,
    setPolyError,
    triggerPolylineFetch
} = polylineSlice.actions;

export default polylineSlice.reducer;
