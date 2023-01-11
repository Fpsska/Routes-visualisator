import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import Leaflet from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { useAppSelector } from '../../app/hooks';

import 'leaflet/dist/leaflet.css';
import './map.scss';

// /. imports

const DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

const Map: React.FC = () => {
    const { currentRouteCoords } = useAppSelector(state => state.requestSlice);

    const [latPosition, setLatPosition] = useState<[number, number]>([51, 19]);

    // /. hooks

    useEffect(() => {
        setLatPosition([
            currentRouteCoords.lat_start,
            currentRouteCoords.lat_end
        ]);
    }, [currentRouteCoords]);

    // /. effects

    return (
        <MapContainer
            className="map-container"
            center={latPosition}
            zoom={13}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />

            <Marker position={latPosition}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
