import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { Menu as AntdMenu } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    setCurrentRouteCoords,
    setCurrentRequestKey
} from '../../app/slices/requestSlice';

// /. imports

interface propTypes {
    isValidCondition: boolean;
    setCollapsedStatus: (arg: boolean) => void;
}

// /. interfaces

const Menu: React.FC<propTypes> = ({
    isValidCondition,
    setCollapsedStatus
}) => {
    const {
        requests,
        currentRequestKey,
        isRequestsDataLoading,
        isTableDataLoading
    } = useAppSelector(state => state.requestSlice);

    const [menuItems, setMenuItems] = useState<any>([]);

    const dispatch = useAppDispatch();

    // /. hooks

    const onMenuItemClick = (e: any): void => {
        dispatch(setCurrentRouteCoords({ id: +e.key }));
        dispatch(setCurrentRequestKey([e.key]));
        setCollapsedStatus(false);
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

    // /. effects

    return (
        <AntdMenu
            theme="dark"
            mode="inline"
            disabled={!isValidCondition || isTableDataLoading}
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
    );
};

export default Menu;
