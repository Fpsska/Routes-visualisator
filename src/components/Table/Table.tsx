import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Table as AntdTable } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    setCurrentRouteCoords,
    setCurrentRequestKey,
    switchTableDataLoadingStatus
} from '../../app/slices/requestSlice';

import { getPropertiesOfHTMLel } from '../../helpers/getPropertyOfHtmlEl';

import type { ColumnsType } from 'antd/es/table';

import type { TableRowSelection } from 'antd/es/table/interface';

import './table.scss';

// /. imports

interface DataType {
    key: React.Key;
    requestNumber: number;
    latitudeStart: number;
    longitudeStart: number;
    latitudeEnd: number;
    longitudeEnd: number;
}

// /. interfaces

const Table: React.FC = () => {
    const {
        requests,
        currentRequestKey,
        isRequestsDataLoading,
        isTableDataLoading
    } = useAppSelector(state => state.requestSlice);

    const [tableData, setTableData] = useState<DataType[]>([]);

    const [tableHeaderHeight, setTableHeaderHeight] = useState<number>(0);

    const dispatch = useAppDispatch();
    const tableRef = useRef<HTMLDivElement>(null!);

    // /. hooks

    const onSelectChange = (key: number): void => {
        dispatch(setCurrentRouteCoords({ id: key }));
        dispatch(setCurrentRequestKey([String(key)]));
    };

    const getTableHeaderHeight = useCallback((): void => {
        if (!tableRef || isTableDataLoading) {
            return;
        }

        setTimeout(() => {
            // wait for render ant-table-header
            const tableHeader =
                tableRef.current.childNodes[0].childNodes[0].childNodes[0]
                    .childNodes[0].childNodes[0];

            const { height } = getPropertiesOfHTMLel(tableHeader);
            setTableHeaderHeight(height);
        }, 100);
    }, [tableRef, isTableDataLoading]);

    // /. functions

    const columns: ColumnsType<DataType> = [
        {
            title: '№ request',
            dataIndex: 'requestNumber',
            sorter: (a, b) => a.requestNumber - b.requestNumber,
            align: 'center',
            width: 120
        },
        {
            title: 'Latitude (start)',
            dataIndex: 'latitudeStart',
            align: 'center',
            width: 150
        },
        {
            title: 'Longitude (start)',
            dataIndex: 'longitudeStart',
            align: 'center',
            width: 150
        },
        {
            title: 'Latitude (finish)',
            dataIndex: 'latitudeEnd',
            align: 'center',
            width: 150
        },
        {
            title: 'Longitude (finish)',
            dataIndex: 'longitudeEnd',
            align: 'center',
            width: 150
        }
    ];

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys: currentRequestKey.map(item => +item),
        onSelect: record => onSelectChange(record.requestNumber),
        type: 'radio'
    };

    // /. variables

    // fix filling tableData[] by dublicated elements
    useEffect(() => setTableData([]), []);

    useEffect(() => {
        // /. update tableData
        if (!requests || isRequestsDataLoading) {
            return;
        }

        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];

            setTableData(prevArr => [
                ...prevArr,
                {
                    key: request.id,
                    requestNumber: request.id,
                    latitudeStart: request.coords.lat_start,
                    longitudeStart: request.coords.lng_start,
                    latitudeEnd: request.coords.lat_end,
                    longitudeEnd: request.coords.lng_end
                }
            ]);
        }

        setTimeout(() => {
            dispatch(switchTableDataLoadingStatus(false));
        }, 1300);
    }, [requests, isRequestsDataLoading]);

    // useEffect(() => {
    //     !isAllowableRes && setXScroll('100vw');
    //     console.log('triggered');
    // }, [isAllowableRes]);

    useEffect(() => {
        // get height of ant-table-header value by init render
        getTableHeaderHeight();

        // get height of ant-table-header by window resize
        window.addEventListener('resize', getTableHeaderHeight);
        return () => {
            window.removeEventListener('resize', getTableHeaderHeight);
        };
    }, [getTableHeaderHeight]);

    // /. effect

    return (
        <AntdTable
            ref={tableRef}
            columns={!isTableDataLoading && requests ? columns : []}
            pagination={false}
            loading={isTableDataLoading}
            rowSelection={rowSelection}
            dataSource={!isTableDataLoading && requests ? tableData : []}
            scroll={{
                x: 'max-content',
                y: `calc(100vh - ${tableHeaderHeight}px - 48px)`
            }}
            style={{ height: '100%' }}
            size="small"
            onRow={record => {
                return {
                    onClick: () => onSelectChange(record.requestNumber)
                };
            }}
        />
    );
};

export default Table;
