import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';

import { Breadcrumb, Layout, Menu, theme, Row, Col } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    switchReqLoadingStatus,
    setReqError
} from '../../app/slices/requestSlice';

import Map from '../Map/Map';
import Preloader from '../Preloader/Preloader';

import { fetchRequestsData } from '../../app/api/fetchRequestsData';

import type { MenuProps } from 'antd';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Requests', 'sub1', <CopyOutlined />, [
        getItem('request №1', '1'),
        getItem('request №2', '2'),
        getItem('request №3', '3')
    ])
];

const App: React.FC = () => {
    const { isRequestsDataLoading } = useAppSelector(
        state => state.requestSlice
    );

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    // /. hooks

    useEffect(() => {
        fetchRequestsData()
            .then(() => {
                console.log('success');
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
            })
            .catch((err: any) => {
                console.log('error');
                dispatch(setReqError(err.message));
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
            });
    }, []);

    // /. effects

    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}
                >
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout className="site-layout">
                    <Content
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <Breadcrumb style={{ padding: '16px' }}>
                            <Breadcrumb.Item>Map</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row
                            style={{
                                flex: '1 1 auto',
                                height: '100%',
                                background: colorBgContainer
                            }}
                        >
                            <Col
                                span={24}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className="map">
                                    <>
                                        {isRequestsDataLoading && (
                                            <div className="map__preloader">
                                                {' '}
                                                <Preloader />
                                            </div>
                                        )}
                                    </>
                                    <Map />
                                </div>
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Footer</Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default App;
