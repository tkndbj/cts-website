"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MapView from './MapView';

interface NavigationProps {
  isNavigating: boolean;
  targetProject: number | null;
}

interface FeaturedProjectStoryProps {
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

export default function FeaturedProjectStory({
  navigationProps,
  currentProject = 1,
  onBack,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  projects = [],
  onProjectSelect,
}: FeaturedProjectStoryProps) {
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
    // Show banner after component mounts
    setTimeout(() => {
      setShowBanner(true);
    }, 300);
  }, []);

  // Handle project change animations - smoother transitions
  useEffect(() => {
    setSelectedUnitByProject({});
    setSelectedInteriorByProject({});
    setShowInteriorTray(false);
    
    // Animate banner out and back in with new content - slower, smoother
    setShowBanner(false);
    setTimeout(() => {
      setBannerKey(prev => prev + 1);
      setShowBanner(true);
    }, 600); // Increased from 300ms to 600ms
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

  const handleUnitDeselect = () => {
    setSelectedUnitByProject(prev => ({
      ...prev,
      [currentProject]: null
    }));
    setSelectedInteriorByProject(prev => ({
      ...prev,
      [currentProject]: null
    }));
    setShowInteriorTray(false);
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
      {/* Modern Project Navigation Bar - positioned below main header */}
      <div 
        className="fixed top-20 left-0 z-40 w-full h-16 backdrop-blur-xl border-b shadow-lg"
        style={{
          backgroundColor: '#191970',
          borderColor: 'rgba(235, 228, 215, 0.3)'
        }}
      >
        <div className="h-full flex items-center justify-between px-6">
          {/* Back button */}
          <div className="flex items-center">
          <button
  onClick={onBack}
  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 hover:border-orange-400/30 transition-all duration-300 text-white backdrop-blur-sm"
>
  <svg 
    width="18" 
    height="18" 
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
  <span className="text-sm font-medium text-white">Ana Sayfa</span>
</button>
          </div>

          {/* Project Names Navigation - Centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1 bg-black/20 rounded-2xl p-1 backdrop-blur-xl border border-white/10">
              {defaultProjects.map((project) => {
                const isActive = currentProject === project.id;
                
                return (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect?.(project.id)}
                    className={`relative px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'text-white shadow-lg scale-105'
                        : 'text-white hover:text-white/80 hover:bg-white/10'
                    }`}
                    style={isActive ? { backgroundColor: '#1F51FF' } : undefined}
                  >
                    {project.title}
                    {isActive && (
                      <div className="absolute inset-0 bg-blue-600/20 rounded-xl animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                hasPrev 
                  ? 'bg-black/5 hover:bg-black/10 text-gray-700 hover:text-blue-600 border border-black/10 hover:border-blue-400/30' 
                  : 'text-gray-400 cursor-not-allowed bg-black/5 border border-black/5'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                hasNext 
                  ? 'bg-white/5 hover:bg-white/10 text-white hover:text-blue-600 border border-white/10 hover:border-blue-400/30' 
                  : 'text-white/20 cursor-not-allowed bg-white/5 border border-white/5'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

      {/* Project Details Banner - slides from left with smoother transition */}
      <div 
        key={bannerKey}
        className={`fixed left-0 top-40 z-30 transition-all duration-700 ease-in-out ${
          showBanner ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div 
          className="rounded-r-2xl shadow-xl backdrop-blur-sm border-r border-t border-b border-white/10 px-6 py-5 max-w-md"
          style={{ backgroundColor: '#191970' }}
        >
          {/* Project Title with Fullscreen Button */}
          <div className="flex items-center justify-between mb-3">
  <h2 
    className="text-2xl md:text-3xl font-bold tracking-tight"
    style={{ color: '#96DED1' }}
  >
    {activeProject.title}
  </h2>
  
  <div className="flex items-center gap-2 ml-3">
    {/* Map Button */}
    <button
      onClick={() => setShowMap(true)}
      className="inline-flex items-center gap-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
      title="Haritada Göster"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
    
    {/* Fullscreen Button - only show when unit is selected */}
    {selectedName && (
      <button
        onClick={() => setFullscreenProjectId(currentProject)}
        className="inline-flex items-center gap-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
        title="Tam ekran"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3H3v6M21 9V3h-6M3 15v6h6M15 21h6v-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}
  </div>
</div>
          
          {/* Project Description */}
          <p className="text-white text-sm md:text-base font-light leading-relaxed mb-4">
            {activeProject.description}
          </p>
          
          {/* Unit Types Section */}
          <div>
            <div className="text-xs uppercase tracking-widest text-white/80 mb-2 font-medium">
              Daire Tipleri
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activeProject.unitTypes.map((unitType, index) => {
                const isActive = selectedName === unitType;
                return (
                  <button
                    key={unitType}
                    onClick={() => handleUnitSelect(unitType)}
                    className={`relative overflow-hidden rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'border-orange-400/80 bg-orange-400/10 text-white scale-105'
                        : 'border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {unitType}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - adjusted for two bars */}
      <div className="fixed inset-0 pt-36">
        <div className="relative w-full h-full">
          {/* Background Image */}
          <Image
            src={bgImage}
            alt={activeProject.title}
            fill
            priority
            style={{ objectFit: "cover" }}
            className="animate-fadeIn"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" />

          {/* Unit Stats */}
          {selectedName && unitData && (
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-10 animate-slideInRight">
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-white/20 backdrop-blur-md px-4 py-3 text-center min-w-[120px]" style={{ backgroundColor: 'rgba(0, 0, 128, 0.3)' }}>
                  <div className="text-xs uppercase tracking-wider text-white/70">
                    Metre Kare
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white mt-1">
                    {unitData.stats?.m2 ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/20 backdrop-blur-md px-4 py-3 text-center min-w-[120px]" style={{ backgroundColor: 'rgba(0, 0, 128, 0.3)' }}>
                  <div className="text-xs uppercase tracking-wider text-white/70">
                    Banyo
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white mt-1">
                    {unitData.stats?.banyo ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/20 backdrop-blur-md px-4 py-3 text-center min-w-[120px]" style={{ backgroundColor: 'rgba(0, 0, 128, 0.3)' }}>
                  <div className="text-xs uppercase tracking-wider text-white/70">
                    Yatak Odası
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white mt-1">
                    {unitData.stats?.yatak ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

         {/* Interior Thumbnails */}
{selectedName && thumbs.length > 0 && (
  <div className={`fixed left-0 right-0 bottom-0 z-[5] px-[5%] pb-6 pt-3 transition-transform duration-500 ${
    showInteriorTray ? 'translate-y-0' : 'translate-y-full'
  }`}>
    <div className="flex justify-center">
      <div className="rounded-2xl border border-white/15 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: 'rgba(0, 0, 128, 0.3)' }}>
        <div className="px-4 py-3 text-white/80 text-xs uppercase tracking-wider">
          İç Mekan Görselleri
        </div>
                <div className="px-4 pb-4">
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${thumbs.length}, minmax(100px, 120px))` }}>
                    {thumbs.map((src) => {
                      const isPicked = selectedInteriorByProject[currentProject] === src;
                      return (
                        <button
                          key={src}
                          className={`group relative aspect-[4/3] overflow-hidden rounded-lg border transition-all duration-300 ${
                            isPicked
                              ? 'border-orange-400/80 ring-2 ring-orange-400'
                              : 'border-white/15 hover:border-white/35'
                          }`}
                          onClick={() => handleInteriorSelect(src)}
                        >
                          <Image
                            src={src}
                            alt="Interior"
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
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
            <div className="fixed inset-0 z-[9999] bg-black animate-fadeIn">
              <div className="absolute inset-0 z-[1]">
                {activeImage && (
                  <Image
                    src={activeImage}
                    alt="Fullscreen"
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                    priority
                  />
                )}
              </div>

              <button
                onClick={closeFullscreen}
                className="absolute top-4 left-4 z-[2] inline-flex items-center gap-2 rounded-xl bg-black/70 hover:bg-black/60 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
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

              {fsThumbList.length > 0 && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[2] max-h-[80vh] overflow-y-auto">
                  <div className="rounded-2xl border border-white/15 bg-transparent backdrop-blur-xl shadow-2xl p-4">
                    <div className="text-white/80 text-xs uppercase tracking-wider mb-3 text-center">
                      İç Mekan Görselleri
                    </div>
                    <div className="flex flex-col gap-2 max-w-[120px]">
                      {fsThumbList.map((src) => {
                        const isPicked = selectedInteriorByProject[pid] === src;
                        return (
                          <button
                            key={src}
                            className={`group relative aspect-[4/3] overflow-hidden rounded-lg border transition-all duration-300 ${
                              isPicked
                                ? 'border-orange-400/80 ring-2 ring-orange-400'
                                : 'border-white/15 hover:border-white/35'
                            }`}
                            onClick={() =>
                              setSelectedInteriorByProject((prev) => ({
                                ...prev,
                                [pid]: src,
                              }))
                            }
                          >
                            <Image
                              src={src}
                              alt="Interior"
                              fill
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        @keyframes slideUpDelay {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          30% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translate(30px, -50%);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideUpDelay {
          animation: slideUpDelay 0.8s ease-out;
        }

        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
      `}</style>
      <MapView 
  isOpen={showMap}
  projectId={currentProject}
  onClose={() => setShowMap(false)}
/>
    </>
  );
}