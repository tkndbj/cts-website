import { useState, useEffect, useRef } from "react";

// Declare google maps types
interface GoogleMapStyle {
  featureType?: string;
  elementType?: string;
  stylers?: Array<{ [key: string]: string | number }>;
}

interface GoogleMap {
  setCenter(location: { lat: number; lng: number }): void;
}

interface GoogleMapsMarker {
  setPosition(location: { lat: number; lng: number }): void;
}

interface GoogleMapsConstructors {
  Map: new (element: HTMLElement, options: {
    center: { lat: number; lng: number };
    zoom: number;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    streetViewControl?: boolean;
    styles?: GoogleMapStyle[];
  }) => GoogleMap;
  Marker: new (options: {
    position: { lat: number; lng: number };
    map: GoogleMap;
    title?: string;
    animation?: number;
  }) => GoogleMapsMarker;
  Animation: {
    DROP: number;
  };
}

declare global {
  interface Window {
    google: {
      maps: GoogleMapsConstructors;
    };
    initMap?: () => void;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectInterest?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    projectInterest: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Office coordinates
  const officeLocation = { lat: 35.322848, lng: 33.963165 };

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    
    if (existingScript) {
      // Script already loaded, just check if Google Maps is ready
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          setMapLoaded(true);
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }
    
    // Only load script if it doesn't exist
    if (!window.google && !existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      window.initMap = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          setMapLoaded(true);
        }
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Clean up only the callback, not the script itself
        delete window.initMap;
      };
    } else if (window.google && window.google.maps && window.google.maps.Map) {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google && window.google.maps) {
      // Check for maps.Map constructor specifically
      if (!window.google.maps.Map) {
        console.log('Google Maps API not fully loaded yet');
        return;
      }
      
      // Initialize the map
      const map = new window.google.maps.Map(mapRef.current, {
        center: officeLocation,
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
  
      // Add a marker for the office
      new window.google.maps.Marker({
        position: officeLocation,
        map: map,
        title: "CTS Cyprus Homes Office",
        animation: window.google.maps.Animation.DROP
      });
    }
  }, [mapLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Lütfen tüm zorunlu alanları doldurun.'
      });
      return;
    }
  
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Mesajınız başarıyla gönderildi!'
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          projectInterest: ""
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`, '_blank');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 md:pt-16">
      {/* Full-width Map Section */}
      <div className="relative h-[35vh] w-full">
        {/* Google Maps Container */}
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        
        {/* Back Button for Mobile - Top Left */}
        <button
          onClick={() => window.history.back()}
          className="md:hidden absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2.5 flex items-center gap-2"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Geri</span>
        </button>
        
        {/* Directions Button - Top Right */}
        <button
          onClick={openDirections}
          className="absolute top-4 right-4 bg-white hover:bg-gray-50 rounded-lg shadow-lg p-3 flex items-center gap-2 transition-all hover:shadow-xl group"
          title="Get Directions"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className="text-[#191970] group-hover:scale-110 transition-transform"
          >
            <path 
              d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5L14 14.5z" 
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Yön</span>
        </button>
      </div>

      {/* Main Content Section - Modified for better mobile scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-1 space-y-3">
              {/* Header */}
              <div className="mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  İletişime <span className="bg-gradient-to-r from-[#191970] to-[#4169E1] bg-clip-text text-transparent">Geçin</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Size özel çözümlerimizi keşfedin
                </p>
              </div>

              {/* Contact Cards with Icons and Hover Effects */}
              <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Telefon</p>
                    <a href="tel:+905391100100" className="text-base font-semibold text-gray-900 hover:text-[#191970] transition-colors">
                      +90 539 110 01 00
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="2"/>
                      <path d="m22 6-10 7L2 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">E-posta</p>
                    <a href="mailto:office@ctscyprushomes.com" className="text-base font-semibold text-gray-900 hover:text-[#191970] transition-colors truncate block">
                      office@ctscyprushomes.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Çalışma Saatleri</p>
                    <p className="text-base font-semibold text-gray-900">Pzt - Cuma: 08:00 - 17:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#191970] to-[#4169E1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Adres</p>
                    <p className="text-base font-semibold text-gray-900">İskele, Kıbrıs</p>
                  </div>
                </div>
              </div>

              {/* Social Media Card with Gradient */}
              <div className="bg-gradient-to-br from-[#191970] via-[#2e3192] to-[#4169E1] rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <p className="text-base font-semibold mb-3">Bizi Takip Edin</p>
                  <div className="flex gap-2">
                    <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center transition-all hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center transition-all hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center transition-all hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Hızlı İletişim Formu</h2>
                <p className="text-sm text-gray-600 mb-4">Size en kısa sürede dönüş yapacağız</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Ad Soyad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all placeholder-gray-500"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        E-posta <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all placeholder-gray-500"
                        placeholder="ornek@email.com"
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Telefon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all placeholder-gray-500"
                        placeholder="+90 5xx xxx xx xx"
                      />
                    </div>

                    {/* Project Interest */}
                    <div>
                      <label htmlFor="projectInterest" className="block text-sm font-medium text-gray-700 mb-1.5">
                        İlgilendiğiniz Proje
                      </label>
                      <select
                        id="projectInterest"
                        name="projectInterest"
                        value={formData.projectInterest}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all text-gray-500"
                      >
                        <option value="">Seçiniz</option>
                        <option value="Four Seasons Life">Four Seasons Life</option>
                        <option value="The Sign">The Sign</option>
                        <option value="Aurora Bay">Aurora Bay</option>
                        <option value="Carob Hill">Carob Hill</option>
                        <option value="Genel Bilgi">Genel Bilgi</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Konu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all placeholder-gray-500"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mesajınız <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all resize-none placeholder-gray-500"
                      placeholder="Mesajınızı buraya yazınız..."
                    />
                  </div>

                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitStatus.type === 'success' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {submitStatus.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`mt-4 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#191970] to-[#4169E1] hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Mesajı Gönder
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}