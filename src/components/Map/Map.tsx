import React, { useEffect } from 'react';

import { TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import { useAppSelector } from '../../app/hooks';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { currentRouteData } = useAppSelector(state => state.requestSlice);

    const map = useMap();

    // /. hooks

    useEffect(() => {
        // follow to new position
        const COORDS: [number, number] = [
            currentRouteData.coords.lat_start,
            currentRouteData.coords.lng_start
        ];
        const ZOOM = 14;

        map.flyTo(COORDS, ZOOM, {
            duration: 2
        });
    }, [currentRouteData]);

    // /. effects

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            <Marker
                position={[
                    currentRouteData.coords.lat_start,
                    currentRouteData.coords.lng_start
                ]}
            >
                {' '}
                <Popup>
                    <ul>
                        <li>Location: {currentRouteData.label}</li>
                        <li>latitude: {currentRouteData.coords.lat_start}</li>
                        <li>longitude: {currentRouteData.coords.lng_start}</li>
                    </ul>
                </Popup>{' '}
            </Marker>
        </>
    );
};

export default Map;
