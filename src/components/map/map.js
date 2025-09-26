import L from "leaflet";
import "leaflet/dist/leaflet.css"

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"


function Map({ lat, long, title, imageUrl }) {
     const equipmentIcon = L.icon({
        iconUrl: imageUrl, 
        iconSize: [40, 40], 
        iconAnchor: [20, 40], 
        popupAnchor: [0, -40], 
        className: "rounded-md border-2 border-white shadow-md bg-white", // optional Tailwind styles
    });
    return (
        // <MapContainer center={[52.505, -0.09]} zoom={13} scrollWheelZoom={true}>
        //     <TileLayer 
        //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //     />
        // </MapContainer>
        
        <MapContainer
                center={[lat, long]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[lat, long]}
                  icon={equipmentIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-sm text-gray-600">Equipment Location</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
    )
}

export default Map;