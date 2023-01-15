import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { MapContainer } from 'react-leaflet';

import { Layout, Menu, theme, Row, Col } from 'antd';

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
    const { isPolylineDataLoading, polylineData } = useAppSelector(
        state => state.polylineSlice
    );

    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState<any>([]);

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    // /. hooks

    const isValidCondition =
        !isRequestsDataLoading &&
        !isPolylineDataLoading &&
        requests &&
        polylineData;

    // /. variables

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
            .catch((error: any) => {
                console.error('error:', error);
                // dispatch(setPolyError());
                // dispatch(setReqError())
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
                        disabled={!isValidCondition}
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
                        <Row style={{ padding: '10px' }}>
                            <ul
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {currentRoutesData.map(route => {
                                    return (
                                        <li
                                            key={route.id}
                                            style={{
                                                margin: '5px'
                                            }}
                                        >
                                            {route.role === 'start'
                                                ? 'Start'
                                                : 'End'}
                                            : <b>lat: {route.coords.lat}</b>
                                            {' / '}
                                            <b>lng: {route.coords.lng}</b>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Row>
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
                                        {!isValidCondition && (
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
                    <Footer style={{ padding: 0 }}></Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default App;
