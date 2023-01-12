import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { MapContainer } from 'react-leaflet';

import { Breadcrumb, Layout, Menu, theme, Row, Col } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    switchReqLoadingStatus,
    setReqError,
    setCurrentRouteCoords
} from '../../app/slices/requestSlice';

import Map from '../Map/Map';
import Preloader from '../Preloader/Preloader';

import { fetchRequestsData } from '../../app/api/fetchRequestsData';

const { Content, Footer, Sider } = Layout;

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    const { isRequestsDataLoading, requests, currentRouteData } =
        useAppSelector(state => state.requestSlice);

    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState<any>([]);

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    // /. hooks

    const onMenuItemClick = (e: any): void => {
        dispatch(setCurrentRouteCoords({ id: +e.key }));
    };

    // /. functions

    useEffect(() => {
        fetchRequestsData()
            .then(() => {
                // console.log('success');
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
            })
            .catch((err: any) => {
                // console.log('error');
                dispatch(setReqError(err.message));
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
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

    useEffect(() => {
        console.log(currentRouteData.coords.lat_start);
    }, [currentRouteData]);

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
                        disabled={isRequestsDataLoading || !requests}
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
                                        {isRequestsDataLoading && (
                                            <div className="map__preloader">
                                                <Preloader />
                                            </div>
                                        )}
                                    </>
                                    <MapContainer
                                        className="map-container"
                                        center={[
                                            currentRouteData.coords.lat_start,
                                            currentRouteData.coords.lng_start
                                        ]}
                                        zoom={8}
                                        scrollWheelZoom={true}
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
