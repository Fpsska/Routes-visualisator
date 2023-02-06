import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { Menu as AntdMenu } from 'antd';

import { MenuMode } from 'rc-menu/lib/interface';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    setCurrentRouteCoords,
    setCurrentRequestKey
} from '../../app/slices/requestSlice';

// /. imports

interface propTypes {
    role: string;
    orientation: MenuMode;
    isValidCondition: boolean;
    setCollapsedStatus?: (arg: boolean) => void;
}

// /. interfaces

const Menu: React.FC<propTypes> = props => {
    const { role, orientation, isValidCondition, setCollapsedStatus } = props;

    const {
        requests,
        currentRequestKey,
        isRequestsDataLoading,
        isTableDataLoading
    } = useAppSelector(state => state.requestSlice);

    const [menuItems, setMenuItems] = useState<any>([]);

    const dispatch = useAppDispatch();

    // /. hooks

    const isMenuDisabled =
        role === 'mobile'
            ? !isValidCondition
            : !isValidCondition || isTableDataLoading;

    // /. variables

    const onMenuItemClick = (e: any): void => {
        dispatch(setCurrentRouteCoords({ id: +e.key }));
        dispatch(setCurrentRequestKey([e.key]));
        setCollapsedStatus && setCollapsedStatus(false);
    };

    // /. functions

    useEffect(() => {
        // generate Menu items elements
        if (!isValidCondition) {
            return;
        }

        const requestTemplates = requests.map(template => {
            return {
                label: `request №${template.id}`,
                key: template.id
            };
        });
        setMenuItems(requestTemplates);
    }, [requests, isValidCondition]);

    // /. effects

    return (
        <AntdMenu
            theme="dark"
            mode={orientation}
            disabled={isMenuDisabled}
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
