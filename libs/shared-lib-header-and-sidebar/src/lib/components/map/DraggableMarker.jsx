import {useState, useRef, useMemo,useEffect} from 'react';
import {useMapEvents, Marker} from "react-leaflet";
import L from 'leaflet';


const LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [25, 41],
        shadowSize:   [50, 64],
        iconAnchor:   [25, 41],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});
const streamingIcon = new LeafIcon({
    iconUrl: require("./marker-icon.png")
});


function DraggableMarker({setCurrentPos,defaultLoc={}}) {
    const [position, setPosition] = useState(Object.keys(defaultLoc).length?defaultLoc:null)

    const markerRef = useRef(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                    setCurrentPos(marker.getLatLng())
                }
            },
        }),
        [],
    )

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            setCurrentPos(e.latlng)
        },
    });

    return position &&
        <Marker
            draggable={true}
            position={position}
            icon={streamingIcon}
            ref={markerRef}
            eventHandlers={eventHandlers}
        />

}

export default DraggableMarker