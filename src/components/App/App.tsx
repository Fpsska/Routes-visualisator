import React, { useEffect } from 'react';

import { MapContainer } from 'react-leaflet';

import { Layout, theme, Row, Col } from 'antd';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    switchReqLoadingStatus,
    setReqError,
    triggerRequestsDataFetch,
    setCoordsDataEmptyStatus
} from '../../app/slices/requestSlice';

import {
    setPolyError,
    triggerPolylineFetch
} from '../../app/slices/polylineSlice';

import Map from '../Map/Map';
import MapPlaceholder from '../Map/MapPlaceholder';
import Sidebar from '../Sidebar/Sidebar';
import Preloader from '../Preloader/Preloader';
import Error from '../Error/Error';

import { fetchRequestsData } from '../../app/api/fetchRequestsData';
import { fetchPolylineData } from '../../app/api/fetchPolylineData';

const { Content, Footer } = Layout;

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    const {
        isRequestsDataLoading,
        requests,
        requestsFetchError,
        currentRoutesData,
        isCoordsDataEmpty
    } = useAppSelector(state => state.requestSlice);
    const { polylineData, polylineFetchError } = useAppSelector(
        state => state.polylineSlice
    );

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const dispatch = useAppDispatch();

    // /. hooks

    const isValidCondition =
        !isRequestsDataLoading &&
        requests &&
        !requestsFetchError &&
        !polylineFetchError;

    const isDashboardEmpty =
        !polylineData && !requestsFetchError && !polylineFetchError;

    // /. variables

    useEffect(() => {
        // handle fetchRequestsData Promise
        fetchRequestsData()
            .then(() => {
                dispatch(triggerRequestsDataFetch());
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
            })
            .catch(({ message }) => {
                console.error('Error of fetchRequestsData promise:', message);
                dispatch(
                    setReqError(
                        `Error of fetchRequestsData promise: ${message}`
                    )
                );
            });
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
            const args = {
                lng_start: currentRoutesData[0].coords.lng,
                lat_start: currentRoutesData[0].coords.lat,
                lng_end: currentRoutesData[1].coords.lng,
                lat_end: currentRoutesData[1].coords.lat
            };

            fetchPolylineData({ ...args })
                .then(() => dispatch(triggerPolylineFetch()))
                .catch(({ message }) => {
                    console.error(
                        'Error of fetchPolylineData promise:',
                        message
                    );
                    dispatch(
                        setPolyError(
                            `Error of fetchPolylineData promise: ${message}`
                        )
                    );
                });
        }
    }, [currentRoutesData, isCoordsDataEmpty]);

    // /. effects

    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Layout className="site-layout">
                    <Sidebar isValidCondition={isValidCondition} />
                    <Content
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        <Row
                            className={
                                isDashboardEmpty
                                    ? 'information-dashboard'
                                    : 'information-dashboard visible'
                            }
                        >
                            <>
                                {requestsFetchError && (
                                    <Error
                                        message={requestsFetchError}
                                        delay={1500}
                                    />
                                )}
                                {polylineFetchError && (
                                    <Error message={polylineFetchError} />
                                )}
                            </>
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
