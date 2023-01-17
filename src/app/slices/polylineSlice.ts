import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

// /. imports

interface IpolylineSlice {
    polylineData: any;
    polylineFetchError: null | string;
}

// /. interfaces

const initialState: IpolylineSlice = {
    polylineData: null,
    polylineFetchError: null
};

// /. state

const polylineSlice = createSlice({
    name: 'polylineSlice',
    initialState,
    reducers: {
        setPolylineData(state, action: PayloadAction<any>) {
            const { waypoints } = action.payload;
            // /. payload

            const extendedWaypointsData = waypoints.map(
                (obj: any, idx: number) => {
                    return {
                        ...obj,
                        role: `${idx === 0 ? 'Start' : 'End'} Location Name`
                    };
                }
            );

            const updatedPolilyneData = {
                ...action.payload,
                waypoints: extendedWaypointsData
            };
            state.polylineData = updatedPolilyneData;
        },
        setPolyError(state, action: PayloadAction<null | string>) {
            state.polylineFetchError = action.payload;
        },
        triggerPolylineFetch() {
            return;
        }
    }
});

export const { setPolylineData, setPolyError, triggerPolylineFetch } =
    polylineSlice.actions;

export default polylineSlice.reducer;
