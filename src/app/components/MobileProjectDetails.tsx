"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import MapView from './MapView';

interface NavigationProps {
  isNavigating: boolean;
  targetProject: number | null;
}

interface MobileProjectDetailsProps {
  navigationProps?: NavigationProps;
  currentProject?: number;
  onBack?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  projects?: Array<{ id: number; title: string; description: string }>;
  onProjectSelect?: (projectId: number) => void;
}

type UnitStats = { m2?: string; banyo?: string; yatak?: string };
type UnitConfig = Record<
  number,
  Record<string, { image?: string; stats?: UnitStats }>
>;
type InteriorConfig = Record<number, Record<string, string[]>>;

const UNIT_CONFIG: UnitConfig = {
  1: {
    Studio: {
      image: "/units/fourseasons/studio.jpg",
      stats: { m2: "45-55", banyo: "1", yatak: "1" },
    },
    Loft: {
      image: "/units/fourseasons/loft.jpg",
      stats: { m2: "60-75", banyo: "1", yatak: "1" },
    },
    "2+1": {
      image: "/units/fourseasons/2p1.jpg",
      stats: { m2: "95-110", banyo: "2", yatak: "2" },
    },
    "3+1": {
      image: "/units/fourseasons/3p1.jpg",
      stats: { m2: "130-150", banyo: "2", yatak: "3" },
    },
  },
  2: {
    Studio: {
      image: "/units/sign/studio.jpg",
      stats: { m2: "40-50", banyo: "1", yatak: "1" },
    },
    "Grand Studio": {
      image: "/units/sign/grand-studio.jpg",
      stats: { m2: "55-65", banyo: "1", yatak: "1" },
    },
    "1+1": {
      image: "/units/sign/1p1.jpg",
      stats: { m2: "70-80", banyo: "1", yatak: "1" },
    },
    "2+1": {
      image: "/units/sign/2p1.jpg",
      stats: { m2: "95-110", banyo: "2", yatak: "2" },
    },
  },
  3: {
    "1+1": {
      image: "/units/aurora/1+1.jpg",
      stats: { m2: "65-75", banyo: "1", yatak: "1" },
    },
    Loft: {
      image: "/units/aurora/loft.jpg",
      stats: { m2: "75-90", banyo: "1", yatak: "1" },
    },
    "2+1 Garden": {
      image: "/units/aurora/2+1-garden.jpg",
      stats: { m2: "100-115", banyo: "2", yatak: "2" },
    },
    "2+1 Infinity": {
      image: "/units/aurora/2+1-infinity.jpg",
      stats: { m2: "110-125", banyo: "2", yatak: "2" },
    },
  },
  4: {
    "1+1": {
      image: "/units/carob/1+1.jpg",
      stats: { m2: "60-70", banyo: "1", yatak: "1" },
    },
    Loft: {
      image: "/units/carob/loft.jpg",
      stats: { m2: "70-85", banyo: "1", yatak: "1" },
    },
    "2+1": {
      image: "/units/carob/2+1.jpg",
      stats: { m2: "95-110", banyo: "2", yatak: "2" },
    },
  },
};

const UNIT_INTERIORS: InteriorConfig = {
  1: {
    Studio: [
      "/units/fourseasons/interior/studio/1.jpg",
      "/units/fourseasons/interior/studio/2.jpg",
    ],
    Loft: [
      "/units/fourseasons/interior/loft/1.jpg",
      "/units/fourseasons/interior/loft/2.jpg",
    ],
    "2+1": [
      "/units/fourseasons/interior/2+1/1.jpg",
      "/units/fourseasons/interior/2+1/2.jpg",
    ],
    "3+1": [
      "/units/fourseasons/interior/3+1/1.jpg",
      "/units/fourseasons/interior/3+1/2.jpg",
    ],
  },
  2: {
    Studio: [
      "/units/sign/interior/studio/1.jpg",
      "/units/sign/interior/studio/2.jpg",
    ],
    "Grand Studio": [
      "/units/sign/interior/grand-studio/1.jpg",
      "/units/sign/interior/grand-studio/2.jpg",
    ],
    "1+1": ["/units/sign/interior/1+1/1.jpg", "/units/sign/interior/1+1/2.jpg"],
    "2+1": ["/units/sign/interior/2+1/1.jpg", "/units/sign/interior/2+1/2.jpg"],
  },
  3: {
    "1+1": [
      "/units/aurora/interior/1+1/1.jpg",
      "/units/aurora/interior/1+1/2.jpg",
    ],
    Loft: [
      "/units/aurora/interior/loft/1.jpg",
      "/units/aurora/interior/loft/2.jpg",
    ],
    "2+1 Garden": [
      "/units/aurora/interior/2+1-garden/1.jpg",
      "/units/aurora/interior/2+1-garden/2.jpg",
      "/units/aurora/interior/2+1-garden/3.jpg",
    ],
    "2+1 Infinity": [
      "/units/aurora/interior/2+1-infinity/1.jpg",
      "/units/aurora/interior/2+1-infinity/2.jpg",
      "/units/aurora/interior/2+1-infinity/3.jpg",
      "/units/aurora/interior/2+1-infinity/4.jpg",
      "/units/aurora/interior/2+1-infinity/5.jpg",
      "/units/aurora/interior/2+1-infinity/6.jpg",
    ],
  },
  4: {
    "1+1": [
      "/units/carob/interior/1+1/1.jpg",
      "/units/carob/interior/1+1/2.jpg",
    ],
    Loft: [
      "/units/carob/interior/loft/1.jpg",
      "/units/carob/interior/loft/2.jpg",
    ],
    "2+1": [
      "/units/carob/interior/2+1/1.jpg",
      "/units/carob/interior/2+1/2.jpg",
    ],
  },
};

export default function MobileProjectDetails({
  navigationProps,
  currentProject = 1,
  onBack,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  projects = [],
  onProjectSelect,
}: MobileProjectDetailsProps) {
  const defaultProjects = [
    {
      id: 1,
      title: "FOUR SEASONS LIFE",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz. Her mevsimin güzelliğini yaşayabileceğiniz modern yaşam alanları.",
      unitTypes: ["Studio", "Loft", "2+1", "3+1"],
    },
    {
      id: 2,
      title: "THE SIGN",
      description:
        "Uzman ekibimiz ile her detayda mükemmellik arayışı. Şehrin kalbinde prestijli yaşamın yeni adresi.",
      unitTypes: ["Studio", "Grand Studio", "1+1", "2+1"],
    },
    {
      id: 3,
      title: "AURORA BAY",
      description:
        "Çevre dostu yapılar ile doğaya saygılı inşaat. Denizin kucakladığı huzurlu yaşam alanları.",
      unitTypes: ["1+1", "Loft", "2+1 Garden", "2+1 Infinity"],
    },
    {
      id: 4,
      title: "CAROB HILL",
      description:
        "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet. Tepenin zirvesinde lüks yaşamın adresi.",
      unitTypes: ["1+1", "Loft", "2+1"],
    },
  ];

  const projectImages = [
    "/fourseasons.jpg",
    "/thesign.jpg", 
    "/aurora.jpg",
    "/carob.jpg"
  ];

  const [selectedUnitByProject, setSelectedUnitByProject] = useState<
    Record<number, string | null>
  >({});
  const [selectedInteriorByProject, setSelectedInteriorByProject] = useState<
    Record<number, string | null>
  >({});
  const [fullscreenProjectId, setFullscreenProjectId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showInteriorTray, setShowInteriorTray] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setShowBanner(true);
    }, 300);
  }, []);

  useEffect(() => {
    setSelectedUnitByProject({});
    setSelectedInteriorByProject({});
    setShowInteriorTray(false);
    
    setShowBanner(false);
    setTimeout(() => {
      setBannerKey(prev => prev + 1);
      setShowBanner(true);
    }, 600);
  }, [currentProject]);

  const activeProject = defaultProjects[currentProject - 1];
  const selectedName = selectedUnitByProject[currentProject] ?? null;
  const unitData = selectedName ? UNIT_CONFIG?.[currentProject]?.[selectedName] : undefined;
  const bgImage = selectedInteriorByProject[currentProject] || 
                  unitData?.image || 
                  projectImages[currentProject - 1];

  const handleUnitSelect = (unitName: string) => {
    setSelectedUnitByProject(prev => ({
      ...prev,
      [currentProject]: unitName
    }));
    setSelectedInteriorByProject(prev => ({
      ...prev,
      [currentProject]: null
    }));
    setShowInteriorTray(true);
  };

  const handleInteriorSelect = (src: string) => {
    setSelectedInteriorByProject(prev => ({
      ...prev,
      [currentProject]: src
    }));
  };

  const stepFullscreenImage = (pid: number, dir: 1 | -1) => {
    const unitName = selectedUnitByProject[pid];
    if (!unitName) return;
    const thumbs = UNIT_INTERIORS[pid]?.[unitName] ?? [];
    if (!thumbs.length) return;

    setSelectedInteriorByProject((prev) => {
      const cur = prev[pid];
      const curIndex = thumbs.indexOf(cur ?? "");
      const nextIndex =
        ((curIndex === -1 ? -1 : curIndex) + dir + thumbs.length) %
        thumbs.length;
      return { ...prev, [pid]: thumbs[nextIndex] };
    });
  };

  const closeFullscreen = () => {
    setFullscreenProjectId(null);
  };

  useEffect(() => {
    if (fullscreenProjectId == null) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFullscreenImage(fullscreenProjectId, 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepFullscreenImage(fullscreenProjectId, -1);
      }
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenProjectId, selectedUnitByProject]);

  const thumbs = selectedName ? (UNIT_INTERIORS[currentProject]?.[selectedName] ?? []) : [];

  return (
    <>
      {/* First Header - Back button and Navigation arrows */}
      <div className="fixed top-14 left-0 z-40 w-full h-10 backdrop-blur-xl border-b shadow-lg md:hidden"
        style={{
          backgroundColor: '#191970',
          borderColor: 'rgba(235, 228, 215, 0.3)'
        }}
      >
        <div className="h-full flex items-center justify-between px-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-black/10 hover:border-orange-400/30 transition-all duration-300 text-white backdrop-blur-sm"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none"
              className="group-hover:text-orange-400 transition-colors text-white"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-medium text-white">Ana Sayfa</span>
          </button>

          {/* Navigation arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                hasPrev 
                  ? 'bg-black/5 hover:bg-black/10 text-white border border-white/10 hover:border-blue-400/30' 
                  : 'text-white/20 cursor-not-allowed bg-white/5 border border-white/5'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                hasNext 
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-blue-400/30' 
                  : 'text-white/20 cursor-not-allowed bg-white/5 border border-white/5'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>     

      {/* Main Content Area */}
      <div className="fixed inset-0 z-20 pt-32 bg-gray-900 md:hidden flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 top-32">
          <Image
            src={bgImage}
            alt={activeProject.title}
            fill
            style={{ objectFit: "cover" }}
            className="brightness-100 animate-fadeIn"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" />
        </div>

        {/* Project Details Banner with Icon Buttons */}
        <div 
          key={bannerKey}
          className={`relative z-10 transition-all duration-700 ease-in-out ${
            showBanner ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-r-2xl shadow-xl border-r border-t border-b border-white/10 px-4 py-3 mr-8 mb-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2" style={{ color: '#96DED1' }}>
                  {activeProject.title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {activeProject.description}
                </p>
              </div>
              
              {/* Icon buttons in side banner */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowMap(true)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition"
                  title="Harita"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" />
                  </svg>
                </button>
                
                {selectedName && (
                  <button
                    onClick={() => setFullscreenProjectId(currentProject)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition"
                    title="Tam Ekran"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 3H3v6M21 9V3h-6M3 15v6h6M15 21h6v-6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unit Stats - Vertical on Right Edge */}
        {selectedName && unitData?.stats && (
          <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-10">
            <div className="flex flex-col gap-2">
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1.5 text-center min-w-[60px]">
                <div className="text-[10px] text-white/60">M²</div>
                <div className="text-sm font-bold text-white">
                  {unitData.stats.m2}
                </div>
              </div>
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1.5 text-center min-w-[60px]">
                <div className="text-[10px] text-white/60">Banyo</div>
                <div className="text-sm font-bold text-white">
                  {unitData.stats.banyo}
                </div>
              </div>
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1.5 text-center min-w-[60px]">
                <div className="text-[10px] text-white/60">Yatak</div>
                <div className="text-sm font-bold text-white">
                  {unitData.stats.yatak}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section - Fixed to bottom */}
        <div className="relative z-10">
          {/* Interior Images Thumbnail Banner */}
          {selectedName && thumbs.length > 0 && (
            <div className={`bg-black/70 backdrop-blur-sm border-t border-white/20 transition-transform duration-500 ${
              showInteriorTray ? 'translate-y-0' : 'translate-y-full'
            }`}>
              <div className="p-2">
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2 px-2">
                  İç Mekan Görselleri
                </div>
                <div className="overflow-x-auto">
                  <div className="flex gap-2" style={{ width: "max-content" }}>
                    {thumbs.map((src, index) => {
                      const isPicked = selectedInteriorByProject[currentProject] === src;
                      return (
                        <button
                          key={index}
                          onClick={() => handleInteriorSelect(src)}
                          className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            isPicked
                              ? "border-orange-400 ring-2 ring-orange-400/50"
                              : "border-white/20"
                          }`}
                        >
                          <Image
                            src={src}
                            alt={`Interior ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unit Types Bottom Bar */}
          <div className="bg-black/70 backdrop-blur-sm border-t border-white/20 p-3 pb-safe">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2 px-2">
              Daire Tipleri
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2" style={{ width: "max-content" }}>
                {activeProject.unitTypes.map((unitType) => (
                  <button
                    key={unitType}
                    onClick={() => handleUnitSelect(unitType)}
                    className={`relative overflow-hidden rounded-lg border ${
                      selectedName === unitType
                        ? "border-orange-400 bg-orange-400/20"
                        : "border-orange-400/30 bg-black/50"
                    } backdrop-blur-sm px-4 py-2 text-center transition-all active:scale-95`}
                  >
                    <div className="text-white font-semibold text-sm whitespace-nowrap">
                      {unitType}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Portal */}
      {mounted && fullscreenProjectId != null && createPortal(
        (() => {
          const pid = fullscreenProjectId;
          const unitName = selectedUnitByProject[pid];
          if (!unitName) return null;
          const activeImage =
            selectedInteriorByProject[pid] ||
            UNIT_CONFIG?.[pid]?.[unitName]?.image ||
            projectImages[pid - 1] ||
            "";
          const fsThumbList = UNIT_INTERIORS[pid]?.[unitName] ?? [];

          return (
            <div className="fixed inset-0 z-[9999] bg-black animate-fadeIn flex flex-col md:hidden">
              {/* Fullscreen Header */}
              <div className="flex-shrink-0 p-4">
                <button
                  onClick={closeFullscreen}
                  className="flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-2 text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">Geri</span>
                </button>
              </div>

              {/* Fullscreen Image */}
              <div className="flex-1 relative">
                <Image
                  src={activeImage}
                  alt="Fullscreen"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                  priority
                />
              </div>

              {/* Fullscreen Interior Thumbnails */}
              {fsThumbList.length > 0 && (
                <div className="flex-shrink-0 bg-black/80 border-t border-white/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                    İç Mekan Görselleri
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex gap-3" style={{ width: "max-content" }}>
                      {fsThumbList.map((src, index) => {
                        const isPicked = selectedInteriorByProject[pid] === src;
                        return (
                          <button
                            key={index}
                            onClick={() =>
                              setSelectedInteriorByProject((prev) => ({
                                ...prev,
                                [pid]: src,
                              }))
                            }
                            className={`relative w-24 h-18 rounded-lg overflow-hidden border-2 transition-all ${
                              isPicked
                                ? "border-orange-400 ring-2 ring-orange-400/50"
                                : "border-white/20"
                            }`}
                          >
                            <Image
                              src={src}
                              alt={`Interior ${index + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })(),
        document.body
      )}

      {/* Map View Modal */}
      <MapView 
        isOpen={showMap}
        projectId={currentProject}
        onClose={() => setShowMap(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
    </>
  );
}