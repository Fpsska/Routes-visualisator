import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// /. imports

interface IrequestSlice {
    requests: any[];
    isRequestsDataLoading: boolean;
    requestsFetchError: null | string;
}

// /. interfaces

const initialState: IrequestSlice = {
    requests: [],
    isRequestsDataLoading: false,
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
            console.log(action.payload);
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
