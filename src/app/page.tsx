"use client";

import { useEffect, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import HeaderBackground from "./components/HeaderBackground";
import ImageGallerySection from "./components/ImageGallerySection";
import FeaturedProjectStory from "./components/FeaturedProjectStory";
import MobileProjectDetails from "./components/MobileProjectDetails";
import Image from "next/image";

// Mobile Navigation Component
function MobileNavigation({
  projects,
  currentProject,
  onProjectSelect,
}: {
  projects: Array<{ id: number; title: string; description: string }>;
  currentProject: number;
  onProjectSelect: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gray-900/95 backdrop-blur-lg border-t border-white/10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60 uppercase tracking-wider">
              Projeler
            </span>
            <span className="text-xs text-white/40">{currentProject}/4</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => onProjectSelect(p.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  currentProject === p.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-white/70 active:bg-white/20"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'gallery' | 'projects'>('hero');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileProject, setMobileProject] = useState(1);
  const [mobileShowProjects, setMobileShowProjects] = useState(false);
  const [mobileShowDetails, setMobileShowDetails] = useState(false);

  const projects = [
    {
      id: 1,
      image: "/fourseasons.jpg",
      title: "Four Seasons Life",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz",
    },
    {
      id: 2,
      image: "/thesign.jpg",
      title: "The Sign",
      description: "Uzman ekibimiz ile her detayda mükemmellik arayışı",
    },
    {
      id: 3,
      image: "/aurora.jpg",
      title: "Aurora Bay",
      description: "Çevre dostu yapılar ile doğaya saygılı inşaat",
    },
    {
      id: 4,
      image: "/carob.jpg",
      title: "Carob Hill",
      description: "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleAdvanceToGallery = () => {
    if (!isMobile) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection('gallery');
        setIsTransitioning(false);
      }, 400);
    } else {
      document.body.classList.add("mobile-second", "mobile-no-scroll");
      setMobileShowProjects(true);
    }
  };

  const handleProjectSelect = (projectId: number) => {
    if (!isMobile) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection('projects');
        setCurrentProjectIndex(projectId - 1);
        setIsTransitioning(false);
      }, 400);
    } else {
      setMobileProject(projectId);
    }
  };

  const handleBackToHero = () => {
    if (isMobile) {
      setMobileProject(1);
      setMobileShowProjects(false);
      setMobileShowDetails(false);
      document.body.classList.remove("mobile-second", "mobile-no-scroll");
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection('hero');
        setCurrentProjectIndex(0);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const handleBackToGallery = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSection('gallery');
      setIsTransitioning(false);
    }, 400);
  };

  const handleNextProject = () => {
    if (currentProjectIndex < projects.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProjectIndex(currentProjectIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevProject = () => {
    if (currentProjectIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProjectIndex(currentProjectIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleMobileDetailsClick = () => {
    setMobileShowDetails(true);
  };

  const handleMobileDetailsBack = () => {
    setMobileShowDetails(false);
  };

  // Show header for all sections except hero
  const showHeader = currentSection !== 'hero' && !isMobile;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Global Header - Only show when not in hero section */}
      {showHeader && (
        <HeaderBackground onLogoClick={handleBackToHero} />
      )}

      <div
        className={`stage fixed inset-0 z-[1] ${
          isTransitioning ? "transitioning" : ""
        }`}
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        {/* Hero Section */}
        <div className={`section-hero absolute inset-0 ${
          currentSection === 'hero' ? 'active' : ''
        }`}>
          <HeroSection
            scrollToTop={handleBackToHero}
            onTapAdvance={handleAdvanceToGallery}
          />
        </div>

        {/* Desktop Gallery & Projects */}
        {!isMobile && (
          <>
            {/* Gallery Section */}
            <div className={`section-gallery absolute inset-0 ${
              currentSection === 'gallery' ? 'active' : ''
            }`}>
              <ImageGallerySection
                scrollToProject={handleProjectSelect}
                navigationProps={{ isNavigating: false, targetProject: null }}
                onBackToHero={handleBackToHero}
              />
            </div>

            {/* Projects Section */}
            <div className={`section-projects absolute inset-0 ${
              currentSection === 'projects' ? 'active' : ''
            }`}>
              <FeaturedProjectStory
                navigationProps={{ isNavigating: false, targetProject: currentProjectIndex + 1 }}
                currentProject={currentProjectIndex + 1}
                onBack={handleBackToGallery}
                onNext={handleNextProject}
                onPrev={handlePrevProject}
                hasNext={currentProjectIndex < projects.length - 1}
                hasPrev={currentProjectIndex > 0}
                projects={projects}
                onProjectSelect={handleProjectSelect}
              />
            </div>
          </>
        )}

        {/* Mobile project display */}
        {isMobile && mobileShowProjects && !mobileShowDetails && (
          <div className="mobile-projects fixed inset-0 z-45 pt-14 pb-20 bg-gray-900">
            <div className="h-full overflow-hidden">
              <div className="relative h-full">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`absolute inset-0 transition-all duration-500 ${
                      mobileProject === project.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="relative h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24">
                        <h2 className="text-3xl font-bold text-orange-500 mb-3">
                          {project.title}
                        </h2>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <button
                          onClick={handleMobileDetailsClick}
                          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 px-4 py-2 text-white font-medium text-sm transition-colors"
                        >
                          <span>Detaylar</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MobileNavigation
              projects={projects}
              currentProject={mobileProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        )}

        {/* Mobile Project Details View */}
        {isMobile && mobileShowDetails && (
          <MobileProjectDetails
            projectId={mobileProject}
            onBack={handleMobileDetailsBack}
          />
        )}
      </div>

      <style jsx global>{`
        html,
        body {
          height: 100%;
          margin: 0;
          overscroll-behavior: none;
          background: #0b0b12;
          overflow: hidden;
        }

        .stage {
          overflow: hidden;
        }

        /* Section transitions - smoother and faster */
        .section-hero,
        .section-gallery,
        .section-projects {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }

        .section-hero {
          transform: scale(1.02);
        }

        .section-gallery {
          transform: translateY(40px);
        }

        .section-projects {
          transform: translateX(40px);
        }

        .section-hero.active,
        .section-gallery.active,
        .section-projects.active {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translate(0, 0);
        }

        /* Remove black flash - smoother transition overlay */
        .stage.transitioning::after {
          content: "";
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(0, 0, 0, 0.2));
          opacity: 0;
          animation: smooth-transition 0.4s ease-in-out;
          pointer-events: none;
          z-index: 100;
          backdrop-filter: blur(1px);
        }

        @keyframes smooth-transition {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
          }
        }

        /* Mobile specific styles */
        @media (max-width: 767px) {
          body.mobile-no-scroll {
            overflow: hidden !important;
            height: 100vh !important;
          }

          body.mobile-second .video-container {
            display: none !important;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}