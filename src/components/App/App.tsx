import React, { useEffect } from 'react';

import { MapContainer } from 'react-leaflet';

import { Layout, theme, Row, Col } from 'antd';

import { useWidthHandler } from 'hooks/useWidthHandler';

import Preloader from 'components/Preloader/Preloader';

import { fetchRequestsData } from 'app/api/fetchRequestsData';

import { fetchPolylineData } from 'app/api/fetchPolylineData';

import {
    switchReqLoadingStatus,
    setReqError,
    triggerRequestsDataFetch,
    setCoordsDataEmptyStatus
} from 'app/slices/requestSlice';

import { setPolyError, triggerPolylineFetch } from 'app/slices/polylineSlice';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import Map from 'components/Map/Map';
import MapPlaceholder from 'components/Map/MapPlaceholder';
import Sidebar from 'components/Sidebar/Sidebar';
import Menu from 'components/Menu/Menu';
import Error from 'components/Error/Error';

const { Content, Footer } = Layout;

import './App.css';
import 'assets/styles/_reset.scss';
import 'assets/styles/style.scss';

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
    const [isMobileRes] = useWidthHandler(768);

    const dispatch = useAppDispatch();

    // /. hooks

    const isValidCondition =
        !isRequestsDataLoading &&
        requests &&
        requests.length > 0 &&
        !requestsFetchError &&
        !polylineFetchError;

    const isDashboardEmpty =
        !polylineData && !requestsFetchError && !polylineFetchError;

    // /. variables

    useEffect(() => {
        // handle fetchRequestsData Promise
        fetchRequestsData()
            .then(() => {
                console.log('!!!');
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
                setTimeout(() => {
                    dispatch(switchReqLoadingStatus(false));
                }, 2000);
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
        if (isCoordsDataEmpty) {
            return;
        }

        const args = {
            lng_start: currentRoutesData[0].coords.lng,
            lat_start: currentRoutesData[0].coords.lat,
            lng_end: currentRoutesData[1].coords.lng,
            lat_end: currentRoutesData[1].coords.lat
        };

        fetchPolylineData({ ...args })
            .then(() => console.log('111'))
            .then(() => dispatch(triggerPolylineFetch()))
            .catch(({ message }) => {
                console.error('Error of fetchPolylineData promise:', message);
                dispatch(
                    setPolyError(
                        `Error of fetchPolylineData promise: ${message}`
                    )
                );
            });
    }, [currentRoutesData, isCoordsDataEmpty]);

    // /. effects

    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Layout className="site-layout">
                    {isMobileRes ? (
                        <Menu
                            role={'mobile'}
                            orientation={'horizontal'}
                            isValidCondition={isValidCondition}
                        />
                    ) : (
                        <Sidebar isValidCondition={isValidCondition} />
                    )}
                    {/* sidebar section */}
                    <Content
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        <Row
                            className={
                                isDashboardEmpty || !isMobileRes
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
                            <ul className="information-dashboard__list list">
                                {polylineData?.waypoints.map(
                                    (waypoint: any) => {
                                        return (
                                            <li
                                                className="list__template"
                                                key={waypoint.hint}
                                            >
                                                <span className="list__name">
                                                    {waypoint.name ||
                                                        waypoint.role}
                                                    :
                                                </span>
                                                <span className="list__coords">
                                                    <b>
                                                        lat:{' '}
                                                        {waypoint.location[1]}
                                                    </b>
                                                    <b>
                                                        lng:{' '}
                                                        {waypoint.location[0]}
                                                    </b>
                                                </span>
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
                                        {isRequestsDataLoading && (
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
                                        zoomControl={false}
                                    >
                                        <Map />
                                    </MapContainer>
                                </div>
                            </Col>
                        </Row>
                        {/* /. map section */}
                    </Content>
                    <Footer style={{ padding: 0 }}></Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default App;
