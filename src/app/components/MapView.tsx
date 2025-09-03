"use client";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Project coordinates - you'll need to update these with actual coordinates
const PROJECT_COORDINATES = {
  1: { lng: 33.969086, lat: 35.325450, name: "FOUR SEASONS LIFE" }, // Antalya example
  2: { lng: 33.470041, lat: 35.218940, name: "THE SIGN" },
  3: { lng: 33.739072, lat: 35.399245, name: "AURORA BAY" },
  4: { lng: 33.726335, lat: 35.383708, name: "CAROB HILL" },
};

interface MapViewProps {
  isOpen: boolean;
  projectId: number;
  onClose: () => void;
}

export default function MapView({ isOpen, projectId, onClose }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Mapbox when component opens
  useEffect(() => {
    if (!isOpen || !mounted) return;

    const loadMapbox = async () => {
      try {
        // Dynamically import Mapbox GL JS
        const mapboxgl = await import('mapbox-gl');
        
        // You'll need to get a Mapbox access token from https://www.mapbox.com/
        mapboxgl.default.accessToken = 'pk.eyJ1IjoidGtuZGJqIiwiYSI6ImNtZjN1Z2VxaTAwbHIycXNpYXBicmJtYTUifQ.vn05fFkvizjzdxgcfPL4EQ';

        if (!mapContainerRef.current || mapRef.current) return;

        const project = PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES];
        
        // Create map instance
        const map = new mapboxgl.default.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite view
          center: [project.lng, project.lat],
          zoom: 1, // Start zoomed out
          pitch: 0,
          bearing: 0,
        });

        map.on('load', () => {
          setIsMapLoaded(true);
          
          // Add custom marker
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #FF6B35, #F7931E);
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `;
          
          new mapboxgl.default.Marker(markerElement)
            .setLngLat([project.lng, project.lat])
            .addTo(map);

          // Dramatic zoom-in animation after a short delay
          setTimeout(() => {
            map.flyTo({
              center: [project.lng, project.lat],
              zoom: 16,
              pitch: 45,
              bearing: 0,
              duration: 3000,
              essential: true
            });
          }, 1000);
        });

        mapRef.current = map;

      } catch (error) {
        console.error('Error loading Mapbox:', error);
        // Fallback to Google Maps embed if Mapbox fails
        loadGoogleMapsEmbed();
      }
    };

    loadMapbox();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapLoaded(false);
    };
  }, [isOpen, projectId, mounted]);

  // Fallback Google Maps embed
  const loadGoogleMapsEmbed = () => {
    const project = PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES];
    if (!mapContainerRef.current) return;

    mapContainerRef.current.innerHTML = `
      <iframe
        width="100%"
        height="100%"
        style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${project.lat},${project.lng}&zoom=16&maptype=satellite">
      </iframe>
    `;
    setIsMapLoaded(true);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black animate-fadeIn">
      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#1a1a2e' }}
      />
      
      {/* Loading Overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-orange-400 border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Harita yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/70 hover:bg-black/60 border border-white/25 transition-all duration-300 text-white backdrop-blur-sm"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none"
              className="group-hover:text-orange-400 transition-colors"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">Geri</span>
          </button>

          {/* Project Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES]?.name}
            </h2>
            <p className="text-white/70 text-sm">Konum Görünümü</p>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    zoom: mapRef.current.getZoom() + 1,
                    duration: 500
                  });
                }
              }}
              className="p-2 rounded-lg bg-black/70 hover:bg-black/60 border border-white/25 text-white transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    zoom: Math.max(1, mapRef.current.getZoom() - 1),
                    duration: 500
                  });
                }
              }}
              className="p-2 rounded-lg bg-black/70 hover:bg-black/60 border border-white/25 text-white transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="mx-auto max-w-md bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-white">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#96DED1' }}>
            {PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES]?.name}
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Konum: {PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES]?.lat.toFixed(4)}, {PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES]?.lng.toFixed(4)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const project = PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES];
                window.open(`https://www.google.com/maps/search/?api=1&query=${project.lat},${project.lng}`, '_blank');
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-400 rounded-lg text-white text-sm font-medium transition"
            >
              Google Maps'te Aç
            </button>
            <button
              onClick={() => {
                if (mapRef.current) {
                  const project = PROJECT_COORDINATES[projectId as keyof typeof PROJECT_COORDINATES];
                  mapRef.current.flyTo({
                    center: [project.lng, project.lat],
                    zoom: 18,
                    pitch: 60,
                    duration: 2000
                  });
                }
              }}
              className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition"
            >
              Yakınlaştır
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
}