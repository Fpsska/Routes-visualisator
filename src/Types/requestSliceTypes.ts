interface Icoord {
    lat_start: number;
    lat_end: number;
    lng_start: number;
    lng_end: number;
}

export interface Irequest {
    id: number;
    coords: Icoord[];
}

export interface IrequestSlice {
    requests: any[];
    currentRouteCoords: any;
    isRequestsDataLoading: boolean;
    requestsFetchError: null | string;
}
