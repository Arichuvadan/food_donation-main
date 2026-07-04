import { useEffect, useMemo, useState } from 'react';
import type { Donation, Recipient, OldAgeHome, Coordinates } from '~/data/donations';
import styles from './donation-map.module.css';

interface DynamicMapComponents {
  MapContainer: React.ComponentType<any>;
  TileLayer: React.ComponentType<any>;
  Marker: React.ComponentType<any>;
  Popup: React.ComponentType<any>;
  CircleMarker: React.ComponentType<any>;
}

interface DonationMapProps {
  donations: Donation[];
  recipients?: Recipient[];
  oldAgeHomes?: OldAgeHome[];
  center?: Coordinates;
  zoom?: number;
  height?: string;
}

export function DonationMap({
  donations,
  recipients = [],
  oldAgeHomes = [],
  center = { lat: 13.0827, lng: 80.2707 }, // Chennai center
  zoom = 12,
  height = '500px',
}: DonationMapProps) {
  const [components, setComponents] = useState<DynamicMapComponents | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([import('leaflet'), import('react-leaflet')])
      .then(([L, reactLeaflet]) => {
        if (!isMounted) return;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        setComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          CircleMarker: reactLeaflet.CircleMarker,
        });
      })
      .catch(error => {
        console.error('Failed to load Leaflet map components:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bounds = useMemo(() => {
    const allCoords = [
      ...donations.map(d => d.coordinates),
      ...recipients.map(r => r.coordinates),
      ...oldAgeHomes.map(h => h.coordinates),
    ];
    if (allCoords.length === 0) return null;

    const lats = allCoords.map(c => c.lat);
    const lngs = allCoords.map(c => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return [[minLat, minLng], [maxLat, maxLng]] as [[number, number], [number, number]];
  }, [donations, recipients, oldAgeHomes]);

  const getStatusColor = (status: string): string => {
    if (status === 'pending') return '#f59e0b';
    if (status === 'in_transit') return '#3b82f6';
    if (status === 'delivered') return '#10b981';
    if (status === 'completed') return '#06b6d4';
    return '#6b7280';
  };

  const getIcon = (L: any, type: string) => {
    const iconUrl = type === 'donation'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      : type === 'recipient'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';

    return L.icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const mapBounds = bounds ? (bounds as any) : undefined;

  if (!components) {
    return (
      <div className={styles.mapPlaceholder} style={{ height }}>
        <div>Loading map…</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, CircleMarker } = components;
  const L = require('leaflet');

  return (
    <div className={styles.mapContainer} style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng] as [number, number]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        bounds={mapBounds}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {donations.map(donation => (
          <CircleMarker
            key={`donation-${donation.id}`}
            center={[donation.coordinates.lat, donation.coordinates.lng] as [number, number]}
            radius={8}
            pathOptions={{
              fillColor: getStatusColor(donation.status),
              color: getStatusColor(donation.status),
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <h4>{donation.foodType}</h4>
                <p><strong>Donor:</strong> {donation.donorName}</p>
                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Status:</strong> <span style={{ color: getStatusColor(donation.status) }}>{donation.status}</span></p>
                <p><strong>Location:</strong> {donation.address}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {recipients.map(recipient => (
          <Marker
            key={`recipient-${recipient.id}`}
            position={[recipient.coordinates.lat, recipient.coordinates.lng] as [number, number]}
            icon={getIcon(L, 'recipient')}
          >
            <Popup>
              <div className={styles.popup}>
                <h4>{recipient.name}</h4>
                <p><strong>Type:</strong> {recipient.type}</p>
                <p><strong>Capacity:</strong> {recipient.capacity} people</p>
                <p><strong>Contact:</strong> {recipient.contactPerson}</p>
                <p><strong>Phone:</strong> {recipient.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {oldAgeHomes.map(home => (
          <Marker
            key={`home-${home.id}`}
            position={[home.coordinates.lat, home.coordinates.lng] as [number, number]}
            icon={getIcon(L, 'home')}
          >
            <Popup>
              <div className={styles.popup}>
                <h4>{home.name}</h4>
                <p><strong>City:</strong> {home.city}</p>
                {home.capacity && <p><strong>Capacity:</strong> {home.capacity} people</p>}
                {home.phone && <p><strong>Phone:</strong> {home.phone}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
