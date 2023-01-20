import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';

import { Layout, Menu } from 'antd';

import Table from '../Table/Table';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    setCurrentRouteCoords,
    setCurrentRequestKey
} from '../../app/slices/requestSlice';

import { useWidthHandler } from '../../hooks/useWidthHandler';

// /. imports

interface propTypes {
    isValidCondition: boolean;
}

const Sidebar: React.FC<propTypes> = ({ isValidCondition }) => {
    const { requests, currentRequestKey, isRequestsDataLoading } =
        useAppSelector(state => state.requestSlice);

    const [collapsed, setCollapsed] = useState(true);
    const [menuItems, setMenuItems] = useState<any>([]);

    const { Sider } = Layout;

    const { isAllowableRes } = useWidthHandler(1300);

    const dispatch = useAppDispatch();

    // /. hooks

    const onMenuItemClick = (e: any): void => {
        // console.log(e);
        dispatch(setCurrentRouteCoords({ id: +e.key }));
        dispatch(setCurrentRequestKey([e.key]));
        // setSelectedMenuKey([+e.key]);
        setCollapsed(false);
    };

    // /. functions

    useEffect(() => {
        // generate Menu items elements
        const requestTemplates = requests.map(template => {
            return {
                label: `request №${template.id}`,
                key: template.id
            };
        });
        setMenuItems(requestTemplates);
    }, [isRequestsDataLoading, requests]);

    useEffect(() => {
        // handle menu collapsed condition
        !isAllowableRes && setCollapsed(true);
    }, [isAllowableRes]);

    // /. effects

    return (
        <Sider
            collapsible={isAllowableRes}
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
            width={'40%'}
        >
            {collapsed ? (
                <Menu
                    theme="dark"
                    mode="inline"
                    // disabled={!isValidCondition}
                    items={[
                        {
                            label: 'Requests',
                            key: 'menu-1',
                            icon: <CopyOutlined />,
                            children: menuItems
                        }
                    ]}
                    selectedKeys={currentRequestKey}
                    onClick={e => onMenuItemClick(e)}
                />
            ) : (
                <Table />
            )}
        </Sider>
    );
};

export default Sidebar;
