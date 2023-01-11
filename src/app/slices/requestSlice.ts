import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IrequestSlice } from '../../Types/requestSliceTypes';

// /. imports

const initialState: IrequestSlice = {
    requests: [],
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
        setRequestsData(state, action: PayloadAction<any[]>) {
            state.requests = action.payload;
        },
        setReqError(state, action: PayloadAction<null | string>) {
            state.requestsFetchError = action.payload;
            state.isRequestsDataLoading = false;
        }
    }
});

export const { setRequestsData, switchReqLoadingStatus, setReqError } =
    requestSlice.actions;

export default requestSlice.reducer;
