import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon fix for Leaflet with Webpack / Next.js
import "leaflet/dist/leaflet.css";
import { useUsersForMap } from "../hooks/useUsers";
import Loading from "../components/loading";
delete (L.Icon.Default.prototype as any)._getIconUrl;
const deliveryIcon = (imageUrl: string, name: string) =>
  L.divIcon({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <span style="
          background:#121E2C;
          color:#fff;
          font-size:14px;
          font-weight:600;
          padding:2px 10px;
          border-radius:8px;
          margin-bottom:4px;
          white-space:nowrap;
        ">
          ${name}
        </span>
        <div style="
          background:url(${imageUrl}) center center / cover no-repeat;
          width:45px; height:45px;
          border-radius:50%;
          border:2px solid #fff;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
        "></div>
      </div>
    `,
    className: "", // removes default leaflet styles
    iconSize: [50, 60],
    iconAnchor: [25, 60], // aligns bottom point to location
    popupAnchor: [0, -60],
  });

export default function DeliveryMapPage() {
  const { data, isLoading } = useUsersForMap({
    page: 1,
    size: 1000,
    role: "DELIVERY",
  });

  // Center map at first delivery or fallback to Cairo
  const center =
    data?.results && data?.results.length > 0
      ? [
          data.results[0]?.latitude || 30.0444,
          data.results[0]?.longitudes || 31.2357,
        ]
      : [30.0444, 31.2357]; // Cairo

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[85vh] bg-gray-50 rounded-xl shadow-inner overflow-hidden">
      <MapContainer
        center={center as L.LatLngExpression}
        zoom={8}
        scrollWheelZoom
        className="w-full h-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data?.results.map((d) => {
          if (!d?.latitude || !d?.longitudes) return null;

          const avatar =
            "http://localhost:3200/" + d?.avatar || "/default-avatar.png";

          return (
            <Marker
              key={d.id}
              position={[+d?.latitude!!, +d?.longitudes!!]}
              icon={deliveryIcon(avatar, d.name)}>
              <Popup>
                <div className="text-sm text-gray-800">
                  <p className="font-bold">{d.name}</p>
                  <p>{d.phone}</p>
                  {/* <p>
                  <span className="text-xs text-gray-500">
                    lat: {d.lat.toFixed(4)}, lng: {d.lng.toFixed(4)}
                  </span>
                </p> */}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
