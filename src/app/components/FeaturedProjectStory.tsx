"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface NavigationProps {
  isNavigating: boolean;
  targetProject: number | null;
}

interface FeaturedProjectStoryProps {
  navigationProps?: NavigationProps;
}

type UnitStats = { m2?: string; banyo?: string; yatak?: string };
type UnitConfig = Record<
  number,
  Record<string, { image?: string; stats?: UnitStats }>
>;
type InteriorConfig = Record<number, Record<string, string[]>>; // projectId -> unitName -> images[]

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
}: FeaturedProjectStoryProps) {
  const projects = [
    {
      id: 1,
      image: "/fourseasons.jpg",
      title: "FOUR SEASONS LIFE",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz. Her mevsimin güzelliğini yaşayabileceğiniz modern yaşam alanları.",
      unitTypes: ["Studio", "Loft", "2+1", "3+1"],
    },
    {
      id: 2,
      image: "/thesign.jpg",
      title: "THE SIGN",
      description:
        "Uzman ekibimiz ile her detayda mükemmellik arayışı. Şehrin kalbinde prestijli yaşamın yeni adresi.",
      unitTypes: ["Studio", "Grand Studio", "1+1", "2+1"],
    },
    {
      id: 3,
      image: "/aurora.jpg",
      title: "AURORA BAY",
      description:
        "Çevre dostu yapılar ile doğaya saygılı inşaat. Denizin kucakladığı huzurlu yaşam alanları.",
      unitTypes: ["1+1", "Loft", "2+1 Garden", "2+1 Infinity"],
    },
    {
      id: 4,
      image: "/carob.jpg",
      title: "CAROB HILL",
      description:
        "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet. Tepenin zirvesinde lüks yaşamın adresi.",
      unitTypes: ["1+1", "Loft", "2+1"],
    },
  ];

  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevActiveProjectIdRef = useRef<number | null>(null);

  const [selectedUnitByProject, setSelectedUnitByProject] = useState<
    Record<number, string | null>
  >({});
  const [selectedInteriorByProject, setSelectedInteriorByProject] = useState<
    Record<number, string | null>
  >({});
  const [fullscreenProjectId, setFullscreenProjectId] = useState<number | null>(
    null
  );

  // FS sırasında görünen projenin snapshot’ı (sadece açılışta set, kapanınca sıfırla)
  const frozenActiveProjectRef = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stepFullscreenImage = (pid: number, dir: 1 | -1) => {
    const unitName = selectedUnitByProject[pid];
    if (!unitName) return;
    const thumbs = UNIT_INTERIORS[pid]?.[unitName] ?? [];
    if (!thumbs.length) return;

    setSelectedInteriorByProject((prev: Record<number, string | null>) => {
      const cur = prev[pid];
      const curIndex = thumbs.indexOf(cur ?? "");
      const nextIndex =
        ((curIndex === -1 ? -1 : curIndex) + dir + thumbs.length) %
        thumbs.length;
      return { ...prev, [pid]: thumbs[nextIndex] };
    });
  };

  useEffect(() => {
    if (fullscreenProjectId == null) return;
    const pid = fullscreenProjectId;

    let cooldown = false;
    let touchStartY: number | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      window.setTimeout(() => (cooldown = false), 300);
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      stepFullscreenImage(pid, dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches?.[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY == null) return;
      const dy = touchStartY - (e.touches?.[0]?.clientY ?? touchStartY);
      if (Math.abs(dy) < 24) return;
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      window.setTimeout(() => (cooldown = false), 300);
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      stepFullscreenImage(pid, dir);
      touchStartY = null;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFullscreenImage(pid, 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepFullscreenImage(pid, -1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      touchStartY = null;
    };
  }, [fullscreenProjectId, selectedUnitByProject]);

  // 🔧 FIX: sadece FS AÇILIRKEN snapshot al; FS KAPANIRKEN snapshot’ı temizle (geri set ETME!)
  useEffect(() => {
    if (fullscreenProjectId != null) {
      // FS açılıyor → o anki projeyi kaydet
      frozenActiveProjectRef.current = activeProjectId;
    } else {
      // FS kapandı → snapshot’ı sıfırla (scroll ve closeFullscreen belirlesin)
      frozenActiveProjectRef.current = null;
    }
  }, [fullscreenProjectId]); // <-- activeProjectId bağımlılığını kaldırdık

  useEffect(() => {
    const el = document.documentElement; // <html>
    if (fullscreenProjectId != null) el.classList.add("fs-lock");
    else el.classList.remove("fs-lock");
    return () => el.classList.remove("fs-lock");
  }, [fullscreenProjectId]);

  const getScrollInfo = () => {
    const proxy = document.querySelector(".scroll-proxy") as HTMLElement | null;
    const vh = window.innerHeight;
    const maxScroll = proxy
      ? Math.max(proxy.offsetHeight - vh, 1)
      : Math.max(document.body.scrollHeight - vh, 1);
    const y = window.scrollY;
    const pct = Math.min(Math.max(y / maxScroll, 0), 1);
    return { pct };
  };

  const projectFromPct = (pct: number): number | null => {
    if (pct < 0.82) return null;
    if (pct < 0.86) return 1;
    if (pct < 0.9) return 2;
    if (pct < 0.94) return 3;
    return 4; // pct >= 0.94
  };

  useEffect(() => {
    const onScroll = () => {
      if (fullscreenProjectId != null) return; // FS açıkken kilitli
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const { pct } = getScrollInfo();
        const pid = projectFromPct(pct);
        setActiveProjectId(pid);
      });
    };

    onScroll(); // ilk durum
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fullscreenProjectId]);

  useEffect(() => {
    const prev = prevActiveProjectIdRef.current;
    if (prev && prev !== activeProjectId) {
      setSelectedUnitByProject((prevState) => {
        if (!prevState[prev]) return prevState;
        return { ...prevState, [prev]: null };
      });
      setSelectedInteriorByProject((prevState) => {
        if (!prevState[prev]) return prevState;
        return { ...prevState, [prev]: null };
      });
    }
    prevActiveProjectIdRef.current = activeProjectId;
  }, [activeProjectId]);

  const getSelectedUnitName = (projectId: number) =>
    selectedUnitByProject[projectId] ?? null;

  const getUnitData = (
    projectId: number,
    unitName: string | null | undefined
  ) => {
    if (!unitName) return undefined;
    return UNIT_CONFIG?.[projectId]?.[unitName];
  };

  const getProjectBgImage = (projectId: number, defaultImage: string) => {
    const chosenInterior = selectedInteriorByProject[projectId];
    if (chosenInterior) return chosenInterior;
    const name = getSelectedUnitName(projectId);
    const data = getUnitData(projectId, name);
    return data?.image || defaultImage;
  };

  useEffect(() => {
    if (navigationProps?.isNavigating && navigationProps?.targetProject) {
      const targetSlide = document.querySelector(
        `.hero-slide-${navigationProps.targetProject}`
      );
      const targetCopy = document.querySelector(
        `.hero-copy-${navigationProps.targetProject}`
      );
      if (targetSlide && targetCopy) {
        (targetSlide as HTMLElement).style.opacity = "1";
        (targetCopy as HTMLElement).style.opacity = "1";
        setTimeout(() => {
          (targetSlide as HTMLElement).style.opacity = "";
          (targetCopy as HTMLElement).style.opacity = "";
        }, 900);
      }
    }
  }, [navigationProps?.isNavigating, navigationProps?.targetProject]);

  const closeFullscreen = () => {
    setFullscreenProjectId(null);
    document.documentElement.classList.remove("fs-lock");
    document.body.style.overflow = "";

    // FS kapanınca aktif projeyi “mevcut scroll yüzdesine” göre belirle
    const apply = () => {
      const { pct } = getScrollInfo();
      setActiveProjectId(projectFromPct(pct));
    };
    apply();
    requestAnimationFrame(apply); // bir sonraki frame’de tekrar (race temiz)
  };

  useEffect(() => {
    if (fullscreenProjectId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenProjectId]);

  useEffect(() => {
    if (fullscreenProjectId != null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreenProjectId]);

  return (
    <>
      <div className="featured-hero fixed top-80px left-0 w-full h-[calc(100vh-80px)] z-[46] overflow-hidden">
        {projects.map((p) => {
          const selectedName = getSelectedUnitName(p.id);
          const bgImage = getProjectBgImage(p.id, p.image);
          return (
            <div key={p.id} className={`hero-slide hero-slide-${p.id} z-[1]`}>
              <Image
                src={bgImage}
                alt={p.title}
                fill
                priority={p.id === 1}
                style={{ objectFit: "cover" }}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/50" />
            </div>
          );
        })}

        {projects.map((p) => {
          const selectedName = getSelectedUnitName(p.id);
          const unitData = getUnitData(p.id, selectedName);
          const displayTitle = selectedName || p.title;

          return (
            <div
              key={p.id}
              className={`hero-copy hero-copy-${p.id}`}
              style={{
                pointerEvents:
                  activeProjectId === p.id
                    ? ("auto" as const)
                    : ("none" as const),
                zIndex: activeProjectId === p.id ? 3 : 2,
              }}
            >
              <div className="px-[5%] text-left max-w-[1200px]">
                {selectedName && (
                  <div className="mb-3 flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => {
                        setSelectedUnitByProject((prev) => ({
                          ...prev,
                          [p.id]: null,
                        }));
                        setSelectedInteriorByProject((prev) => ({
                          ...prev,
                          [p.id]: null,
                        }));
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-black/70 hover:bg-black/80 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
                      title="Geri"
                    >
                      <svg
                        width="18"
                        height="18"
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
                      <span className="text-sm">Geri</span>
                    </button>

                    <button
                      onClick={() => setFullscreenProjectId(p.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-black/70 hover:bg-black/80 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
                      title="Tam ekran"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 3H3v6M21 9V3h-6M3 15v6h6M15 21h6v-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">Tam ekran</span>
                    </button>
                  </div>
                )}

                <h2 className="text-5xl md:text-7xl font-extrabold text-orange-500 tracking-tight mb-4 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
                  {displayTitle}
                </h2>

                <p className="max-w-3xl text-white/95 text-lg md:text-2xl font-light leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
                  {p.description}
                </p>

                {selectedName && (
                  <div className="mt-6 pointer-events-auto">
                    <div className="grid grid-cols-3 gap-3 max-w-md">
                      <div className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-4 py-3 text-center">
                        <div className="text-xs uppercase tracking-wider text-white/70">
                          Metre Kare
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-white mt-1">
                          {unitData?.stats?.m2 ?? "—"}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-4 py-3 text-center">
                        <div className="text-xs uppercase tracking-wider text-white/70">
                          Banyo
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-white mt-1">
                          {unitData?.stats?.banyo ?? "—"}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-4 py-3 text-center">
                        <div className="text-xs uppercase tracking-wider text-white/70">
                          Yatak Odası
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-white mt-1">
                          {unitData?.stats?.yatak ?? "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedName &&
                  (() => {
                    const thumbs = UNIT_INTERIORS[p.id]?.[selectedName] ?? [];
                    if (!thumbs.length) return null;
                    return (
                      <div
                        className={`thumb-tray fixed left-0 right-0 bottom-0 z-[5] px-[5%] pb-6 pt-3 ${
                          activeProjectId === p.id ? "thumb-tray--open" : ""
                        }`}
                        style={{
                          pointerEvents:
                            activeProjectId === p.id ? "auto" : "none",
                        }}
                      >
                        <div className="mx-auto max-w-[1200px] rounded-2xl border border-white/15 bg-black/35 backdrop-blur-xl shadow-2xl">
                          <div className="px-4 py-3 text-white/80 text-xs uppercase tracking-wider">
                            İç Mekan Görselleri
                          </div>
                          <div className="px-4 pb-4">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                              {thumbs.map((src) => {
                                const isPicked =
                                  selectedInteriorByProject[p.id] === src;
                                return (
                                  <button
                                    key={src}
                                    className={`group relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-300 ${
                                      isPicked
                                        ? "border-orange-400/80 ring-2 ring-orange-400"
                                        : "border-white/15 hover:border-white/35"
                                    }`}
                                    onClick={() => {
                                      if (activeProjectId === p.id) {
                                        setSelectedInteriorByProject(
                                          (prev) => ({ ...prev, [p.id]: src })
                                        );
                                      }
                                    }}
                                  >
                                    <Image
                                      src={src}
                                      alt="Interior"
                                      fill
                                      style={{ objectFit: "cover" }}
                                      unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                <div className="mt-8 pointer-events-auto">
                  <div className="text-sm uppercase tracking-widest text-white/80 mb-1 font-medium">
                    Daire Tipleri
                  </div>
                  <div className="text-xs text-white/60 mb-4 font-light">
                    Detay için tıklayın
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                    {p.unitTypes.map((u, index) => {
                      const isActive = selectedName === u;
                      return (
                        <div
                          key={u}
                          className={`group relative overflow-hidden rounded-xl border-3 border-orange-400/30 bg-black/60 px-4 py-3 backdrop-blur-lg shadow-xl transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "scale-105 border-orange-400/80 ring-2 ring-orange-400"
                              : "hover:scale-105 hover:border-orange-400/60"
                          }`}
                          style={{
                            animation: `unit-fade-in 0.6s ease-out forwards`,
                            animationDelay: `${index * 0.1}s`,
                            opacity: 0,
                          }}
                          onClick={() => {
                            if (activeProjectId === p.id) {
                              setSelectedUnitByProject((prev) => ({
                                ...prev,
                                [p.id]: u,
                              }));
                              setSelectedInteriorByProject((prev) => ({
                                ...prev,
                                [p.id]: null,
                              }));
                            }
                          }}
                          role="button"
                          aria-pressed={isActive}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (activeProjectId === p.id) {
                                setSelectedUnitByProject((prev) => ({
                                  ...prev,
                                  [p.id]: u,
                                }));
                                setSelectedInteriorByProject((prev) => ({
                                  ...prev,
                                  [p.id]: null,
                                }));
                              }
                            }
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative z-10 text-center">
                            <div className="text-base md:text-lg font-semibold text-white/95 mb-1">
                              {u}
                            </div>
                            <div className="w-full h-0.5 bg-gradient-to-r from-orange-400/60 to-orange-500/60 rounded-full opacity-70" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mounted &&
        createPortal(
          (() => {
            if (fullscreenProjectId == null) return null;
            const pid = fullscreenProjectId;
            const unitName = selectedUnitByProject[pid];
            if (!unitName) return null;
            const activeImage =
              selectedInteriorByProject[pid] ||
              UNIT_CONFIG?.[pid]?.[unitName]?.image ||
              projects.find((pr) => pr.id === pid)?.image ||
              "";
            const thumbs = UNIT_INTERIORS[pid]?.[unitName] ?? [];

            return (
              <div className="fs-overlay fixed inset-0 z-[9999] pointer-events-auto">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 z-[1]">
                  {activeImage && (
                    <Image
                      src={activeImage}
                      alt="Fullscreen"
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                      priority
                      className="fs-image"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="absolute top-4 left-4 z-[2]">
                  <button
                    onClick={closeFullscreen}
                    className="inline-flex items-center gap-2 rounded-xl bg-black/70 hover:bg-black/60 border border-white/25 px-3 py-2 text-white transition backdrop-blur-sm"
                    title="Kapat"
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

                {thumbs.length > 0 && (
                  <div className="absolute left-0 right-0 bottom-0 px-6 pb-6 pt-4 z-[2]">
                    <div className="mx-auto max-w-[1400px] rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl shadow-2xl">
                      <div className="px-4 py-3 text-white/80 text-xs uppercase tracking-wider">
                        İç Mekan Görselleri
                      </div>
                      <div className="px-4 pb-4">
                        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                          {thumbs.map((src) => {
                            const isPicked =
                              selectedInteriorByProject[pid] === src;
                            return (
                              <button
                                key={src}
                                className={`group relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-300 ${
                                  isPicked
                                    ? "border-orange-400/80 ring-2 ring-orange-400"
                                    : "border-white/15 hover:border-white/35"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            );
                          })}
                        </div>
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
        .top-80px {
          top: 80px;
        }

        .hero-slide,
        .hero-copy {
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        .hero-copy {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          transform: translateY(10px);
          pointer-events: none; /* default kapalı; aktifte inline ile açıyoruz */
          z-index: 2;
        }

        @keyframes unit-fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-slide-1 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 82% 86%;
        }
        .hero-copy-1 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 82% 86%;
        }

        .hero-slide-2 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 86% 90%;
        }
        .hero-copy-2 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 86% 90%;
        }

        .hero-slide-3 {
          animation: slide-in linear both;
          animation-timeline: scroll(root);
          animation-range: 90% 94%;
        }
        .hero-copy-3 {
          animation: copy-in linear both;
          animation-timeline: scroll(root);
          animation-range: 90% 94%;
        }

        .hero-slide-4 {
          animation: slide-last linear both;
          animation-timeline: scroll(root);
          animation-range: 94% 98%;
        }
        .hero-copy-4 {
          animation: copy-last linear both;
          animation-timeline: scroll(root);
          animation-range: 94% 98%;
        }

        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: scale(1.02);
          }
          15% {
            opacity: 1;
            transform: scale(1);
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes slide-last {
          0% {
            opacity: 0;
            transform: scale(1.02);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes copy-in {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          25% {
            opacity: 1;
            transform: translateX(0);
          }
          75% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100px);
          }
        }
        @keyframes copy-last {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          30% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-copy {
          will-change: transform, opacity;
        }
        .featured-hero {
          contain: layout paint;
          will-change: opacity, transform;
        }

        @media (max-width: 768px) {
          .hero-copy :global(h2) {
            font-size: 2.2rem;
          }
          .hero-copy :global(p) {
            font-size: 1rem;
          }
        }

        .thumb-tray {
          transform: translateY(110%);
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .thumb-tray--open {
          transform: translateY(0%);
        }

        .fs-overlay {
          animation: fs-fade 240ms ease-out both;
        }
        @keyframes fs-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        2 .fs-image {
          opacity: 0;
          animation: fs-img-in 260ms ease-out forwards;
        }
        @keyframes fs-img-in {
          to {
            opacity: 1;
          }
        }

        :global(html.fs-lock) .featured-hero .hero-slide,
        :global(html.fs-lock) .featured-hero .hero-copy {
          animation-play-state: paused !important;
        }

        .hero-slide {
          pointer-events: none;
        }
        .hero-copy,
        .thumb-tray {
          touch-action: manipulation;
        }
      `}</style>
    </>
  );
}
