import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { useAppSelector } from '../../app/hooks';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './map.scss';

// /. imports

const Map: React.FC = () => {
    const { currentRouteCoords } = useAppSelector(state => state.requestSlice);

    const [startPosition, setStartPosition] = useState<[number, number]>([
        49.28594, -123.11129
    ]); // latitude_start + longitude_start

    // /. hooks

    useEffect(() => {
        setStartPosition([
            currentRouteCoords.lat_start,
            currentRouteCoords.lng_start
        ]);
    }, [currentRouteCoords]);

    // /. effects

    return (
        <MapContainer
            className="map-container"
            center={startPosition}
            zoom={13}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />

            <Marker position={startPosition}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
