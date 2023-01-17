import React, { useState, useEffect } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { MapContainer } from 'react-leaflet';

import { Layout, Menu, theme, Row, Col } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    switchReqLoadingStatus,
    setReqError,
    setCurrentRouteCoords,
    triggerRequestsDataFetch,
    setCoordsDataEmptyStatus
} from '../../app/slices/requestSlice';

import {
    setPolyError,
    triggerPolylineFetch
} from '../../app/slices/polylineSlice';

import Map from '../Map/Map';
import MapPlaceholder from '../Map/MapPlaceholder';
import Preloader from '../Preloader/Preloader';

import { fetchRequestsData } from '../../app/api/fetchRequestsData';
import { fetchPolylineData } from '../../app/api/fetchPolylineData';

import { useWidthHandler } from '../../hooks/useWidthHandler';

const { Content, Footer, Sider } = Layout;

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    const {
        isRequestsDataLoading,
        requests,
        currentRoutesData,
        isCoordsDataEmpty
    } = useAppSelector(state => state.requestSlice);
    const { polylineData } = useAppSelector(state => state.polylineSlice);

    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState<any>([]);

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    const { isAllowableRes } = useWidthHandler(1300);

    // /. hooks

    const isValidCondition = !isRequestsDataLoading && requests;

    // /. variables

    const onMenuItemClick = (e: any): void => {
        dispatch(setCurrentRouteCoords({ id: +e.key }));
    };

    // /. functions

    useEffect(() => {
        // handle fetchRequestsData Promise
        fetchRequestsData()
            .then(() => {
                dispatch(triggerRequestsDataFetch());
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
            })
            .catch((error: any) =>
                console.error(
                    'Error of fetchRequestsData promise:',
                    error.message
                )
            );
    }, []);

    useEffect(() => {
        // define coods empty status
        const isRoutesDataHasCoords = currentRoutesData
            .map(item => item.coords)
            .some(obj => obj.lat !== 0 || obj.lng !== 0);

        isRoutesDataHasCoords
            ? dispatch(setCoordsDataEmptyStatus(false))
            : dispatch(setCoordsDataEmptyStatus(true));
    }, [currentRoutesData]);

    useEffect(() => {
        // handle fetchPolylineData Promise
        if (!isCoordsDataEmpty) {
            console.log('fetchPolylineData');

            const args = {
                lng_start: currentRoutesData[0].coords.lng,
                lat_start: currentRoutesData[0].coords.lat,
                lng_end: currentRoutesData[1].coords.lng,
                lat_end: currentRoutesData[1].coords.lat
            };

            fetchPolylineData({ ...args })
                .then(() => dispatch(triggerPolylineFetch()))
                .catch((error: any) =>
                    console.error(
                        'Error of fetchPolylineData promise:',
                        error.message
                    )
                );
        }
    }, [currentRoutesData, isCoordsDataEmpty]);

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
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible={isAllowableRes}
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}
                >
                    <Menu
                        theme="dark"
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
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Row
                            style={{
                                padding: '10px'
                            }}
                        >
                            <ul
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {polylineData?.waypoints.map(
                                    (waypoint: any) => {
                                        return (
                                            <li
                                                key={waypoint.hint}
                                                style={{
                                                    margin: '5px'
                                                }}
                                            >
                                                <span>
                                                    {waypoint.name ||
                                                        waypoint.role}
                                                </span>
                                                :{' '}
                                                <b>
                                                    lat: {waypoint.location[1]}
                                                </b>
                                                {' / '}
                                                <b>
                                                    lng: {waypoint.location[0]}
                                                </b>
                                            </li>
                                        );
                                    }
                                )}
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
                                        center={[10, 10]}
                                        zoom={4}
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
