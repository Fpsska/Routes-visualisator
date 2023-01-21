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

export interface IcurrentRoute {
    id: number;
    role: string;
    label: string;
    coords: { lat: number; lng: number };
}

export interface IrequestSlice {
    requests: Irequest[];
    currentRoutesData: IcurrentRoute[];
    isRequestsDataLoading: boolean;
    requestsFetchError: null | string;
    isCoordsDataEmpty: boolean;
    currentRequestKey: string[]; // antd Menu comp accept only string[] for selectedKeys[]
    isTableDataLoading: boolean;
}
