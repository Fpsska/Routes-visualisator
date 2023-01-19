import React, { useState, useEffect, useRef } from 'react';

import { Table as AntdTable } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { setCurrentRouteCoords } from '../../app/slices/requestSlice';

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
    const { requests, isRequestsDataLoading } = useAppSelector(
        state => state.requestSlice
    );

    const [tableData, setTableData] = useState<DataType[]>([]);
    const [isTableDataLoading, setTableDataLoadingStatus] =
        useState<boolean>(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const dispatch = useAppDispatch();

    // /. hooks

    const onSelectChange = (key: number): void => {
        setSelectedRowKeys([key]);
        dispatch(setCurrentRouteCoords({ id: key }));
    };

    // /. functions

    const columns: ColumnsType<DataType> = [
        {
            title: '№ request',
            dataIndex: 'requestNumber',
            sorter: (a, b) => a.requestNumber - b.requestNumber,
            align: 'center'
        },
        {
            title: 'Latitude (start)',
            dataIndex: 'latitudeStart',
            align: 'center'
        },
        {
            title: 'Longitude (start)',
            dataIndex: 'longitudeStart',
            align: 'center'
        },
        {
            title: 'Latitude (finish)',
            dataIndex: 'latitudeEnd',
            align: 'center'
        },
        {
            title: 'Longitude (finish)',
            dataIndex: 'longitudeEnd',
            align: 'center'
        }
    ];

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onSelect: record => onSelectChange(record.requestNumber),
        type: 'radio'
    };

    // /. variables

    // fix filling tableData[] by dublicated elements
    useEffect(() => setTableData([]), []);

    useEffect(() => {
        // /. update tableData
        if (requests && !isRequestsDataLoading) {
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

            setTableDataLoadingStatus(false);
        }
    }, [requests, isRequestsDataLoading]);

    useEffect(() => {
        console.log(selectedRowKeys);
    }, [selectedRowKeys]);

    // /. effect

    return (
        <AntdTable
            columns={columns}
            pagination={false}
            loading={isTableDataLoading}
            rowSelection={rowSelection}
            dataSource={tableData}
            scroll={{ x: '100%', y: 'calc(100vh - 50px)' }}
            style={{ height: '100%' }}
            onRow={record => {
                return {
                    onClick: () => onSelectChange(record.requestNumber)
                };
            }}
        />
    );
};

export default Table;
