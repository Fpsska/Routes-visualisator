interface Icoord {
    coords: {
        lat_start: number;
        lng_start: number;
        lat_end: number;
        lng_end: number;
    };
}

export interface Irequest extends Icoord {
    id: number;
}

interface IcurrentRoute extends Icoord {
    label: string;
}

export interface IrequestSlice {
    requests: Irequest[];
    currentRouteData: IcurrentRoute;
    isRequestsDataLoading: boolean;
    requestsFetchError: null | string;
}
