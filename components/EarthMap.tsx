'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, ZoomControl, LayerGroup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer, Overlay } = LayersControl;

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EarthMapProps {
  issues?: any[];
  onRegionSelect?: (issue: any) => void;
}

function LocationProbe() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position}
      icon={L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 12px; height: 12px; background: var(--accent-info); border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px var(--accent-info);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      })}
    >
      <Popup className="nasa-popup">
        <div className="panel" style={{ minWidth: '180px', padding: '10px' }}>
          <div className="panel-header" style={{ margin: '-10px -10px 10px -10px', color: 'var(--accent-info)' }}>
             GEO-LOCATION PROBE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>LATITUDE:</span>
              <span className="data-value">{position.lat.toFixed(6)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>LONGITUDE:</span>
              <span className="data-value">{position.lng.toFixed(6)}</span>
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.7rem', color: '#555', fontStyle: 'italic', textAlign: 'center' }}>
            Click anywhere else to move probe
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function EarthMap({ issues = [], onRegionSelect }: EarthMapProps) {
  const [mounted, setMounted] = useState(false);
  const instanceId = process.env.NEXT_PUBLIC_SENTINEL_HUB_INSTANCE_ID || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="map-placeholder panel grid-bg" style={{ height: '100%', width: '100%' }} />;

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      zoomControl={false}
      style={{ height: '100%', width: '100%', background: '#050505' }}
    >
      <LocationProbe />
      <LayersControl position="topright">
        {/* ... existing layers ... */}
        <BaseLayer checked name="Earth OS Dark">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </BaseLayer>

        <BaseLayer name="NASA World Imagery">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
          />
        </BaseLayer>

        <BaseLayer name="Planetary Topographic">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />
        </BaseLayer>

        <BaseLayer name="Voyager Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </BaseLayer>
        
        <Overlay name="Copernicus Sentinel-2 (Satellite)">
          <WMSTileLayer
            url={`https://services.sentinel-hub.com/ogc/wms/${instanceId}`}
            layers="TRUE-COLOR-S2-L1C"
            format="image/png"
            transparent={true}
            version="1.3.0"
            attribution='&copy; ESA/Sentinel Hub'
            opacity={0.9}
            maxZoom={18}
          />
        </Overlay>

        <Overlay name="NASA Night Lights (VIIRS)">
          <TileLayer
            url="https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}/{z}/{y}/{x}.jpg"
            attribution='&copy; NASA EOSDIS GIBS'
            minZoom={1}
            maxZoom={8}
            // Passing custom props for NASA WMTS
            {...{
              time: '2012-01-01',
              tilematrixset: 'GoogleMapsCompatible_Level8'
            } as any}
          />
        </Overlay>

        <style jsx global>{`
          .leaflet-popup-content-wrapper {
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border);
            border-radius: 0;
            padding: 0;
            color: white;
          }
          .leaflet-popup-tip {
            background: #0a0a0a;
          }
          .leaflet-popup-content {
            margin: 0;
            padding: 0;
          }
        `}</style>

        <Overlay checked name="Anomalies">
          <LayerGroup>
            {issues.map((issue) => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div class="status-indicator status-${issue.severity} pulse" style="width: 12px; height: 12px; border: 2px solid white;"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6]
                })}
              >
                <Popup className="nasa-popup">
                  <div className="panel" style={{ minWidth: '220px', padding: '10px' }}>
                    <div className="panel-header" style={{ margin: '-10px -10px 10px -10px', color: `var(--accent-${issue.severity})` }}>
                      <span>ANOMALY DETECTED</span>
                      <span style={{ fontSize: '0.6rem' }}>[{issue.severity.toUpperCase()}]</span>
                    </div>
                    <div style={{ padding: '5px 0' }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                        <strong style={{ color: 'var(--accent-info)' }}>TYPE:</strong> {issue.type.toUpperCase()}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>LAT:</span>
                          <span style={{ color: 'var(--foreground)' }}>{issue.latitude.toFixed(6)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>LNG:</span>
                          <span style={{ color: 'var(--foreground)' }}>{issue.longitude.toFixed(6)}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: '1.4', marginBottom: '10px' }}>
                        {issue.explanation}
                      </p>
                    </div>
                    <button 
                      className="panel" 
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        fontSize: '0.75rem', 
                        background: 'var(--accent-primary)', 
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                      }}
                      onClick={() => onRegionSelect?.(issue)}
                    >
                      INITIALIZE AI SCAN
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </Overlay>
      </LayersControl>

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
