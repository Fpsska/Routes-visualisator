interface Icoord {
    lat_end: number;
    lat_start: number;
    lng_end: number;
    lng_start: number;
}

interface Irequest {
    id: number;
    coords: Icoord[];
}

export interface IrequestSlice {
    requests: Irequest[];
    isRequestsDataLoading: boolean;
    requestsFetchError: null | string;
}
