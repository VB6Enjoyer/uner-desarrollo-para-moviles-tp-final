/// <reference types="@capacitor/google-maps" />
/// <reference types="googlemaps" />

import { GoogleMapConfig } from '@capacitor/google-maps';

declare module '@capacitor/google-maps' {
    interface GoogleMapConfig extends Omit<google.maps.MapOptions, 'styles'> {
        styles?: google.maps.MapTypeStyle[];
    }
}