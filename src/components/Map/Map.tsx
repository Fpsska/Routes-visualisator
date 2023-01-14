import React, { useState, useEffect } from 'react';

import { TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';

import polyline from '@mapbox/polyline';

import { useAppSelector } from '../../app/hooks';

import { IcurrentRoute } from '../../Types/requestSliceTypes';

import { getCustomMarker } from '../../helpers/getCustomMarker';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { currentRoutesData } = useAppSelector(state => state.requestSlice);
    const { polylineData } = useAppSelector(state => state.polylineSlice);

    const [polylineCoords, setPolylineCoords] = useState<any[]>([]);

    const map = useMap();

    // /. hooks

    useEffect(() => {
        // follow to new position
        const COORDS: [number, number] = [
            currentRoutesData[0].coords.lat,
            currentRoutesData[0].coords.lng
        ];
        const ZOOM = 14;
        map.flyTo(COORDS, ZOOM, {
            duration: 2
        });
    }, [currentRoutesData]);

    useEffect(() => {
        // transform getted OSRM API data to latlng-format
        const routesData = polylineData.routes;

        if (routesData) {
            const encodedLine = routesData[0].geometry;
            const waypointsData = polyline.decode(encodedLine);
            setPolylineCoords(waypointsData);
        }
    }, [polylineData]);

    // /. effects

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            <>
                {currentRoutesData.map((route: IcurrentRoute) => {
                    return (
                        <Marker
                            key={route.id}
                            position={[route.coords.lat, route.coords.lng]}
                            icon={getCustomMarker(
                                route.role === 'start' ? 'blue' : 'green'
                            )}
                        >
                            <Popup>
                                <ul>
                                    <li>Location: {route.label}</li>
                                    <li>latitude: {route.coords.lat}</li>
                                    <li>longitude: {route.coords.lng}</li>
                                </ul>
                            </Popup>
                        </Marker>
                    );
                })}
            </>
            <Polyline positions={polylineCoords} />
        </>
    );
};

export default Map;
