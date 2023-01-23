import React, { useState, useEffect } from 'react';

import {
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
    ZoomControl,
    FeatureGroup
} from 'react-leaflet';

import polyline from '@mapbox/polyline';

import { useAppSelector } from '../../app/hooks';

import { getCustomMarker } from '../../helpers/getCustomMarker';

import { useWidthHandler } from '../../hooks/useWidthHandler';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { polylineData } = useAppSelector(state => state.polylineSlice);

    const [polylineCoords, setPolylineCoords] = useState<any[]>([]);

    const map = useMap();
    const [isMobileRes] = useWidthHandler(768);

    // /. hooks

    useEffect(() => {
        if (!polylineData || !map) {
            return;
        }

        const { waypoints, routes } = polylineData;

        // follow to new position

        // received: waypoints.location: [lng, lat]
        const COORDS: [number, number][] = [
            [waypoints[0].location[1], waypoints[0].location[0]], // lat, lng
            [waypoints[1].location[1], waypoints[1].location[0]]
        ];

        map.flyToBounds(COORDS, {
            maxZoom: map.getBoundsZoom(COORDS),
            animate: true,
            duration: 1,
            padding: [90, 90]
        });

        // transform getted OSRM API data to polyline position format
        const encodedLine = routes[0].geometry;
        const waypointsData = polyline.decode(encodedLine);
        setPolylineCoords(waypointsData);
    }, [polylineData, map]);

    // /. effects

    return (
        <>
            <TileLayer
                attribution={String(process.env.REACT_APP_MAP_ATTRIBUTION)}
                url={String(process.env.REACT_APP_MAP_URL)}
            />
            <ZoomControl position={isMobileRes ? 'bottomleft' : 'topleft'} />
            <FeatureGroup>
                {polylineData && (
                    <>
                        <>
                            {polylineData.waypoints.map((waypoint: any) => {
                                return (
                                    <Marker
                                        key={waypoint.hint}
                                        position={[
                                            // lat , lng
                                            waypoint.location[1],
                                            waypoint.location[0]
                                        ]}
                                        icon={getCustomMarker(
                                            waypoint.role.match('Start')
                                                ? 'blue'
                                                : 'green'
                                        )}
                                    >
                                        <Popup>
                                            <ul>
                                                <li>
                                                    Location:{' '}
                                                    {waypoint.name ||
                                                        waypoint.role}
                                                </li>
                                                <li>
                                                    latitude:{' '}
                                                    {waypoint.location[1]}
                                                </li>
                                                <li>
                                                    longitude:{' '}
                                                    {waypoint.location[0]}
                                                </li>
                                            </ul>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </>
                        <Polyline positions={polylineCoords} />
                    </>
                )}
            </FeatureGroup>
        </>
    );
};

export default Map;
