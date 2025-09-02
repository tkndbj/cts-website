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

  const project = PROJECT_DATA[projectId];
  const unitData = selectedUnit ? UNIT_CONFIG[projectId]?.[selectedUnit] : null;
  const interiors = selectedUnit
    ? UNIT_INTERIORS[projectId]?.[selectedUnit]
    : null;

  const handleUnitSelect = (unitName: string) => {
    setSelectedUnit(unitName);
    setSelectedInterior(null);
  };

  const handleBack = () => {
    if (selectedUnit) {
      setSelectedUnit(null);
      setSelectedInterior(null);
    } else {
      onBack();
    }
  };

  const bgImage = selectedInterior || unitData?.image || `/fourseasons.jpg`;

  return (
    <div className="fixed inset-0 z-45 pt-14 pb-20 bg-gray-900 md:hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="p-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-2 text-white text-sm mb-4"
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
            <span>{selectedUnit ? "Daire Tipleri" : "Projeler"}</span>
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            {selectedUnit || project.title}
          </h2>

          {!selectedUnit ? (
            /* Unit Types Selection */
            <>
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Daire Tipleri
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {project.unitTypes.map((unitType) => (
                  <button
                    key={unitType}
                    onClick={() => handleUnitSelect(unitType)}
                    className="relative overflow-hidden rounded-lg border border-orange-400/30 bg-black/50 backdrop-blur-sm p-4 text-center transition-all active:scale-95"
                  >
                    <div className="text-white font-semibold text-sm">
                      {unitType}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Selected Unit Details */
            <>
              {/* Stats */}
              {unitData?.stats && (
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm p-3 text-center">
                    <div className="text-xs text-white/60">M²</div>
                    <div className="text-lg font-bold text-white">
                      {unitData.stats.m2}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm p-3 text-center">
                    <div className="text-xs text-white/60">Banyo</div>
                    <div className="text-lg font-bold text-white">
                      {unitData.stats.banyo}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/20 bg-black/60 backdrop-blur-sm p-3 text-center">
                    <div className="text-xs text-white/60">Yatak</div>
                    <div className="text-lg font-bold text-white">
                      {unitData.stats.yatak}
                    </div>
                  </div>
                </div>
              )}

              {/* Interior Images */}
              {interiors && interiors.length > 0 && (
                <>
                  <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                    İç Mekan Görselleri
                  </div>
                  <div className="overflow-x-auto -mx-4 px-4">
                    <div
                      className="flex gap-2 pb-2"
                      style={{ width: "max-content" }}
                    >
                      {interiors.map((src, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedInterior(src)}
                          className={`relative w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
