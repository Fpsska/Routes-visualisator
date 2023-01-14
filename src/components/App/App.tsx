import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { MapContainer } from 'react-leaflet';

import { Breadcrumb, Layout, Menu, theme, Row, Col } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    switchReqLoadingStatus,
    setReqError,
    setCurrentRouteCoords,
    triggerRequestsDataFetch
} from '../../app/slices/requestSlice';

import {
    switchPolyLoadingStatus,
    setPolyError,
    triggerPolylineFetch
} from '../../app/slices/polylineSlice';

import Map from '../Map/Map';
import MapPlaceholder from '../Map/MapPlaceholder';
import Preloader from '../Preloader/Preloader';

import { fetchRequestsData } from '../../app/api/fetchRequestsData';
import { fetchPolylineData } from '../../app/api/fetchPolylineData';

const { Content, Footer, Sider } = Layout;

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    const { isRequestsDataLoading, requests, currentRoutesData } =
        useAppSelector(state => state.requestSlice);
    const { isPolylineDataLoading } = useAppSelector(
        state => state.polylineSlice
    );

    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState<any>([]);

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    // /. hooks

    const onMenuItemClick = (e: any): void => {
        dispatch(setCurrentRouteCoords({ id: +e.key }));
        dispatch(triggerPolylineFetch());
        dispatch(triggerRequestsDataFetch());
    };

    // /. functions

    useEffect(() => {
        Promise.all([fetchRequestsData, fetchPolylineData])
            .then(() => {
                dispatch(triggerPolylineFetch());
                dispatch(triggerRequestsDataFetch());
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                    dispatch(switchPolyLoadingStatus(false));
                }, 2000);
            })
            .catch(() => {
                console.error('error');
            });
    }, []);

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
                        disabled={
                            isRequestsDataLoading ||
                            isPolylineDataLoading ||
                            !requests
                        }
                        items={[
                            {
                                label: 'Requests',
                                key: 'menu-1',
                                icon: <CopyOutlined />,
                                children: menuItems
                            }
                        ]}
                        onClick={e => onMenuItemClick(e)}
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
                                        {isRequestsDataLoading &&
                                            isPolylineDataLoading && (
                                                <div className="map__preloader">
                                                    <Preloader />
                                                </div>
                                            )}
                                    </>
                                    <MapContainer
                                        className="map-container"
                                        center={[
                                            currentRoutesData[0].coords.lat,
                                            currentRoutesData[0].coords.lng
                                        ]}
                                        zoom={8}
                                        scrollWheelZoom={true}
                                        placeholder={<MapPlaceholder />}
                                    >
                                        <Map />
                                    </MapContainer>
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
