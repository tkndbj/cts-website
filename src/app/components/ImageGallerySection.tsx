"use client";
import { useState, useEffect, useRef } from "react";

interface ImageGallerySectionProps {
  scrollToProject: (projectId: number) => void;
  navigationProps?: {
    isNavigating: boolean;
    targetProject: number | null;
  };
  onBackToHero?: () => void;
}

export default function ImageGallerySection({
  scrollToProject,
  navigationProps,
  onBackToHero,
}: ImageGallerySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const officeCoordinates = { lng: 33.963165, lat: 35.322848 };

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Load Mapbox for the globe
  useEffect(() => {
    const loadMapbox = async () => {
      try {
        const mapboxgl = await import('mapbox-gl');
        mapboxgl.default.accessToken = 'pk.eyJ1IjoidGtuZGJqIiwiYSI6ImNtZjN1Z2VxaTAwbHIycXNpYXBicmJtYTUifQ.vn05fFkvizjzdxgcfPL4EQ';

        if (!mapContainerRef.current || mapRef.current) return;

        const map = new mapboxgl.default.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12', // More colorful satellite style
          center: [officeCoordinates.lng, officeCoordinates.lat],
          zoom: 3,
          pitch: 45, // Add some perspective
          bearing: 20,
          interactive: true,
          attributionControl: false,
        });

        map.on('load', () => {
          setIsMapLoaded(true);
          
          // Add custom marker with midnight blue
          const markerElement = document.createElement('div');
          markerElement.innerHTML = `
            <div style="
              width: 35px;
              height: 35px;
              background: linear-gradient(135deg, #191970, #4169E1);
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 6px 20px rgba(25, 25, 112, 0.5);
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
            </div>
          `;
          
          new mapboxgl.default.Marker(markerElement)
            .setLngLat([officeCoordinates.lng, officeCoordinates.lat])
            .addTo(map);

          // Add atmospheric effects
          map.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 0.0],
              'sky-atmosphere-sun-intensity': 15
            }
          });

          // Smooth rotation animation
          const rotateCamera = (timestamp: number) => {
            map.rotateTo((timestamp / 150) % 360, { duration: 0 });
            requestAnimationFrame(rotateCamera);
          };
          requestAnimationFrame(rotateCamera);
        });

        mapRef.current = map;

      } catch (error) {
        console.error('Error loading Mapbox:', error);
        setIsMapLoaded(true); // Show fallback
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
  }, []);

  return (
    <>
      {/* Main Container with White Background */}
      <div className="fixed inset-0 pt-20 bg-white overflow-hidden">
        <div className="h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left Content Section */}
          <div className="flex-1 flex items-center justify-center pr-8">
            <div className="max-w-xl">
              {/* Main Title */}
              <div className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-gray-900">Ceyhun Tunalı</span>
                  <br />
                  <span className="text-[#191970]">&amp; Sons</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed mb-8">
                  40 yılı aşkın deneyimimizle, Ceyhun Tunalı & Sons olarak hayallerinizi 
                  gerçeğe dönüştürüyoruz. Her projede kalite, güven ve mükemmellik vadediyoruz.
                </p>
              </div>

              {/* Key Points */}
              <div className={`transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#191970] rounded-full flex items-center justify-center mt-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">En Son Teknoloji</h3>
                      <p className="text-gray-600 text-sm">En son teknolojiyi kullanarak projelerinizi tamamlıyoruz</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#191970] rounded-full flex items-center justify-center mt-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Premium Kalite</h3>
                      <p className="text-gray-600 text-sm">En iyi malzemeler ve işçilik garantisi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#191970] rounded-full flex items-center justify-center mt-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Uzman Ekip</h3>
                      <p className="text-gray-600 text-sm">Deneyimli mimar ve mühendislerimiz</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#191970] rounded-full flex items-center justify-center mt-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Çevre Dostu</h3>
                      <p className="text-gray-600 text-sm">Sürdürülebilir yapı teknolojileri</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => scrollToProject(1)}
                    className="group inline-flex items-center justify-center gap-3 bg-[#191970] hover:bg-[#1e2050] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>Projelerimizi İnceleyin</span>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  
                  <button
                    onClick={onBackToHero}
                    className="inline-flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Ana Sayfa</span>
                  </button>
                </div>
              </div>

              {/* Company Stats */}
              <div className={`transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#191970] mb-1">40+</div>
                      <div className="text-xs text-gray-600">Yıl Deneyim</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#191970] mb-1">30+</div>
                      <div className="text-xs text-gray-600">Tamamlanan Proje</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#191970] mb-1">100%</div>
                      <div className="text-xs text-gray-600">Müşteri Memnuniyeti</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Globe Section */}
          <div className="flex-1 flex items-center justify-center pl-8">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="relative">
                {/* Enhanced Globe Container */}
                <div className="w-[450px] h-[450px] rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-green-400 relative">
                  {/* Outer glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#191970]/20 to-transparent blur-sm"></div>
                  
                  <div 
                    ref={mapContainerRef}
                    className="w-full h-full relative z-10"
                  />
                  
                  {/* Loading State */}
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-400 z-20">
                      <div className="text-center">
                        <div className="inline-block w-10 h-10 border-4 border-white border-l-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white text-sm font-medium">Dünya haritası yükleniyor...</p>
                      </div>
                    </div>
                  )}

                  {/* Atmospheric ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 shadow-inner"></div>
                </div>

                {/* Enhanced Office Info Card */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-xs">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center shadow-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2">Merkez Ofisimiz</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        <span className="font-medium">İskele, Kıbrıs</span><br />
                        <span className="text-[#191970] font-mono text-xs">35.322848, 33.963165</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute -top-6 -right-6 w-10 h-10 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-full animate-float shadow-lg"></div>
                <div className="absolute top-16 -left-6 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full animate-float-delay-1 shadow-md"></div>
                <div className="absolute -bottom-4 right-16 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full animate-float-delay-2 shadow-sm"></div>
                
                {/* Orbital rings */}
                <div className="absolute inset-0 rounded-full border border-[#191970]/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border border-blue-300/30 animate-spin-reverse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.9;
          }
          50% { 
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite 1s;
        }

        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite 2s;
        }

        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 20s linear infinite;
        }

        /* Enhanced Mapbox globe styling */
        .mapboxgl-canvas {
          border-radius: 50% !important;
        }
      `}</style>
    </>
  );
}