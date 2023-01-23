import React, { useState, useEffect } from 'react';

import { Layout } from 'antd';

import Table from '../Table/Table';
import Menu from '../Menu/Menu';

import { useWidthHandler } from '../../hooks/useWidthHandler';

// /. imports

interface propTypes {
    isValidCondition: boolean;
}

const Sidebar: React.FC<propTypes> = ({ isValidCondition }) => {
    const [isCollapsed, setCollapsedStatus] = useState(true);

    const { Sider } = Layout;

    const [isTabletRes] = useWidthHandler(1024);
    const [isMobileRes] = useWidthHandler(768);

    // /. hooks

    useEffect(() => {
        // handle isCollapsed by keydown event
        const keyHandler = (e: KeyboardEvent): void => {
            if (!isCollapsed && e.code === 'Escape') {
                setCollapsedStatus(true);
            }
        };

        document.addEventListener('keydown', keyHandler);
        return () => {
            document.removeEventListener('keydown', keyHandler);
        };
    }, [isCollapsed]);

    // /. effects

    return (
        <Sider
            collapsible={true}
            collapsed={isCollapsed}
            onCollapse={value => setCollapsedStatus(value)}
            width={isTabletRes ? '28%' : '30%'}
            hidden={isMobileRes}
        >
            {isCollapsed ? (
                <Menu
                    role={'desktop'}
                    orientation={'inline'}
                    isValidCondition={isValidCondition}
                    setCollapsedStatus={setCollapsedStatus}
                />
            ) : (
                <Table />
            )}
        </Sider>
    );
};

export default Sidebar;
