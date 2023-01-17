import React, { useState, useEffect } from 'react';

import {
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
    useMapEvents
} from 'react-leaflet';

import polyline from '@mapbox/polyline';

import { useAppSelector } from '../../app/hooks';

import { getCustomMarker } from '../../helpers/getCustomMarker';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { polylineData, isPolylineDataLoading } = useAppSelector(
        state => state.polylineSlice
    );

    const [polylineCoords, setPolylineCoords] = useState<any[]>([]);
    const map = useMap();

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

        map.fitBounds(COORDS, { maxZoom: 14, animate: true, duration: 2 });

        // transform getted OSRM API data to polyline position format
        const encodedLine = routes[0].geometry;
        const waypointsData = polyline.decode(encodedLine);
        setPolylineCoords(waypointsData);
    }, [polylineData]);

    // /. effects

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <>
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
                        <>
                            <Polyline positions={polylineCoords} />
                        </>
                    </>
                )}
            </>
        </>
    );
};

export default Map;
