"use client";
import { useState } from "react";
import Image from "next/image";

interface MobileProjectDetailsProps {
  projectId: number;
  onBack: () => void;
}

type UnitStats = { m2?: string; banyo?: string; yatak?: string };

const UNIT_CONFIG: Record<
  number,
  Record<string, { image?: string; stats?: UnitStats }>
> = {
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

const UNIT_INTERIORS: Record<number, Record<string, string[]>> = {
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

const PROJECT_DATA: Record<number, { title: string; unitTypes: string[] }> = {
  1: {
    title: "FOUR SEASONS LIFE",
    unitTypes: ["Studio", "Loft", "2+1", "3+1"],
  },
  2: {
    title: "THE SIGN",
    unitTypes: ["Studio", "Grand Studio", "1+1", "2+1"],
  },
  3: {
    title: "AURORA BAY",
    unitTypes: ["1+1", "Loft", "2+1 Garden", "2+1 Infinity"],
  },
  4: {
    title: "CAROB HILL",
    unitTypes: ["1+1", "Loft", "2+1"],
  },
};

export default function MobileProjectDetails({
  projectId,
  onBack,
}: MobileProjectDetailsProps) {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedInterior, setSelectedInterior] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const project = PROJECT_DATA[projectId];
  const unitData = selectedUnit ? UNIT_CONFIG[projectId]?.[selectedUnit] : null;
  const interiors = selectedUnit
    ? UNIT_INTERIORS[projectId]?.[selectedUnit]
    : null;

  const handleUnitSelect = (unitName: string) => {
    setSelectedUnit(unitName);
    setSelectedInterior(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const bgImage = selectedInterior || unitData?.image || `/fourseasons.jpg`;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex-shrink-0 p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 p-2 text-white"
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
        </div>

        {/* Fullscreen Image */}
        <div className="flex-1 relative">
          <Image
            src={bgImage}
            alt={project.title}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Fullscreen Interior Thumbnails */}
        {selectedUnit && interiors && interiors.length > 0 && (
          <div className="flex-shrink-0 bg-black/80 border-t border-white/20 p-4">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
              İç Mekan Görselleri
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {interiors.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedInterior(src)}
                    className={`relative w-24 h-18 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedInterior === src
                        ? "border-orange-400 ring-2 ring-orange-400/50"
                        : "border-white/20"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Interior ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-45 pt-14 bg-gray-900 md:hidden flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 top-14">
        <Image
          src={bgImage}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 p-4 space-y-3">
        {/* First Row: Back Button with Project Name */}
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex-1 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-2 text-white text-sm h-10"
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
            <span>Projeler</span>
            <span className="text-orange-400 font-semibold ml-auto">
              {project.title}
            </span>
          </button>
        </div>

        {/* Second Row: Fullscreen Button and Stats */}
        <div className="flex items-center gap-3">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 p-2 text-white h-10 w-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Stats - shown when unit is selected */}
          {selectedUnit && unitData?.stats && (
            <>
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1 text-center h-10 flex flex-col justify-center min-w-[45px]">
                <div className="text-xs text-white/60 leading-none">M²</div>
                <div className="text-sm font-bold text-white leading-none">
                  {unitData.stats.m2}
                </div>
              </div>
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1 text-center h-10 flex flex-col justify-center min-w-[45px]">
                <div className="text-xs text-white/60 leading-none">Banyo</div>
                <div className="text-sm font-bold text-white leading-none">
                  {unitData.stats.banyo}
                </div>
              </div>
              <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm px-2 py-1 text-center h-10 flex flex-col justify-center min-w-[45px]">
                <div className="text-xs text-white/60 leading-none">Yatak</div>
                <div className="text-sm font-bold text-white leading-none">
                  {unitData.stats.yatak}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4">
        {/* Content can be added here if needed */}
      </div>

      {/* Bottom Section - Fixed to bottom */}
      <div className="relative z-10 flex-shrink-0">
        {/* Interior Images Thumbnail Banner */}
        {selectedUnit && interiors && interiors.length > 0 && (
          <div className="bg-black/70 backdrop-blur-sm border-t border-white/20">
            <div className="p-2">
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2 px-2">
                İç Mekan Görselleri
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-2" style={{ width: "max-content" }}>
                  {interiors.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedInterior(src)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedInterior === src
                          ? "border-orange-400 ring-2 ring-orange-400/50"
                          : "border-white/20"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Interior ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unit Types Bottom Bar - Attached to very bottom */}
        <div className="bg-black/70 backdrop-blur-sm border-t border-white/20 p-3 pb-5">
          <div className="text-xs uppercase tracking-wider text-white/60 mb-2 px-2">
            Daire Tipleri
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-2" style={{ width: "max-content" }}>
              {project.unitTypes.map((unitType) => (
                <button
                  key={unitType}
                  onClick={() => handleUnitSelect(unitType)}
                  className={`relative overflow-hidden rounded-lg border ${
                    selectedUnit === unitType
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
  );
}
