import React, { useEffect } from 'react';

import { TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import { useAppSelector } from '../../app/hooks';

import { IcurrentRoute } from '../../Types/requestSliceTypes';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { currentRoutesData } = useAppSelector(state => state.requestSlice);

    const map = useMap();

    // /. hooks

    // /. functions

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
        </>
    );
};

export default Map;
