"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import HeroSection from "@/components/HeroSection";
import HeaderBackground from "@/components/HeaderBackground";
import ImageGallerySection from "@/components/ImageGallerySection";
import FeaturedProjectStory from "@/components/FeaturedProjectStory";
import MobileProjectDetails from "@/components/MobileProjectDetails";
import ContactForm from "@/components/iletisim";
import AboutUs from "@/components/aboutus";
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
  const t = useTranslations('Mobile');
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#191970]/95 backdrop-blur-lg border-t border-white/10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60 uppercase tracking-wider">
              {t('projects')}
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
                    ? "bg-[#2a2a8a]"
                    : "bg-white/10 text-white/70 active:bg-white/20"
                }`}
                style={{
                  color: currentProject === p.id ? '#96DED1' : undefined
                }}
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

// Mobile Header Component
function MobileHeader({ 
  onLogoClick,
  onProjectsClick,
  onContactClick,
  onAboutClick
}: { 
  onLogoClick?: () => void;
  onProjectsClick?: () => void;
  onContactClick?: () => void;
  onAboutClick?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#191970]/95 backdrop-blur-md shadow-lg flex items-center justify-between px-4"
      style={{ fontFamily: 'Figtree, sans-serif' }}
    >
      <button
        className="text-white font-semibold text-sm tracking-tight flex items-center"
        onClick={onLogoClick}
        aria-label={t('home')}
      >
        <span>Ceyhun Tunalı</span>
        <span className="text-[#96DED1] ml-1">&amp; Sons</span>
      </button>

      <div className="relative">
        <button
          aria-label={t('openMenu')}
          className="p-2 rounded-md border border-white/20 text-white"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-xl bg-[#191970]/95 backdrop-blur border border-white/20 shadow-xl overflow-hidden"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onAboutClick?.();
              }}
              className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              {t('about')}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onProjectsClick?.();
              }}
              className="block w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              {t('projects')}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onContactClick?.();
              }}
              className="block w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              {t('contact')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'gallery' | 'projects' | 'contact' | 'about'>('hero');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileProject, setMobileProject] = useState(1);
  const [mobileShowGallery, setMobileShowGallery] = useState(false);
  const [mobileShowProjects, setMobileShowProjects] = useState(false);
  const [mobileShowDetails, setMobileShowDetails] = useState(false);
  const [mobileShowContact, setMobileShowContact] = useState(false);
  const [mobileShowAbout, setMobileShowAbout] = useState(false);
  
  // Add mounted state to prevent initial flash
  const [mounted, setMounted] = useState(false);
  
  const t = useTranslations('Projects');
  const tButtons = useTranslations('Buttons');

  const projects = [
    {
      id: 1,
      image: "/fourseasons.jpg",
      title: "Four Seasons Life",
      description: t('fourSeasonsDesc'),
    },    
    {
      id: 2,
      image: "/aurora.png",
      title: "Aurora Bay",
      description: t('auroraDesc'),
    },
    {
      id: 3,
      image: "/carob.png",
      title: "Carob Hill",
      description: t('carobDesc'),
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      setMobileShowGallery(true);
    }
  };

  const handleAboutClick = () => {
    if (isMobile) {
      setMobileShowGallery(false);
      setMobileShowProjects(false);
      setMobileShowContact(false);
      setMobileShowAbout(true);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection('about');
        setIsTransitioning(false);
      }, 400);
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
      setMobileShowGallery(false);
      setMobileShowProjects(true);
      setMobileProject(projectId);
    }
  };

  const handleBackToHero = () => {
    if (isMobile) {
      setMobileProject(1);
      setMobileShowGallery(false);
      setMobileShowProjects(false);
      setMobileShowDetails(false);
      setMobileShowContact(false);
      setMobileShowAbout(false);
      document.body.classList.remove("mobile-second", "mobile-no-scroll");
      setCurrentSection('hero');
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
    if (isMobile) {
      setMobileShowProjects(false);
      setMobileShowDetails(false);
      setMobileShowContact(false);
      setMobileShowGallery(true);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection('gallery');
        setIsTransitioning(false);
      }, 400);
    }
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

  const showHeader = currentSection !== 'hero' && !isMobile;
  const showMobileHeader = isMobile && (mobileShowGallery || mobileShowProjects || mobileShowDetails || mobileShowContact || mobileShowAbout);

  // Don't render anything until mounted to prevent flash
  if (!mounted) {
    return null;
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Desktop Header */}
      {showHeader && (
        <HeaderBackground 
          onLogoClick={handleBackToHero}
          onProjectsClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentSection('projects');
              setCurrentProjectIndex(0);
              setIsTransitioning(false);
            }, 400);
          }}
          onContactClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentSection('contact');
              setIsTransitioning(false);
            }, 400);
          }}
          onAboutClick={handleAboutClick}
        />
      )}

      {/* Mobile Header */}
      {showMobileHeader && (
        <MobileHeader 
          onLogoClick={handleBackToHero}
          onProjectsClick={() => {
            setMobileShowGallery(false);
            setMobileShowProjects(true);
            setMobileProject(1);
          }}
          onContactClick={() => {
            setMobileShowGallery(false);
            setMobileShowProjects(false);
            setMobileShowContact(true);
          }}
          onAboutClick={handleAboutClick}
        />
      )}

      <div
        className={`stage fixed inset-0 z-[1] ${
          isTransitioning ? "transitioning" : ""
        }`}
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        {/* Hero Section - Always render this first */}
        <div className={`section-hero absolute inset-0 ${
          (currentSection === 'hero' && (!isMobile || (!mobileShowGallery && !mobileShowProjects && !mobileShowDetails && !mobileShowContact))) ? 'active' : ''
        }`}>
          <HeroSection
            scrollToTop={handleBackToHero}
            onTapAdvance={handleAdvanceToGallery}
          />
        </div>

        {/* Desktop sections - Only render when not in hero to prevent flash */}
        {!isMobile && currentSection !== 'hero' && (
          <>
            {/* Gallery Section */}
            <div className={`section-gallery absolute inset-0 ${
              currentSection === 'gallery' ? 'active' : ''
            }`}>
              <ImageGallerySection
                scrollToProject={handleProjectSelect}
                navigationProps={{ isNavigating: false, targetProject: null }}
                onBackToHero={handleBackToHero}
                onContactClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentSection('contact');
                    setIsTransitioning(false);
                  }, 400);
                }}
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

            {/* Contact Section */}
            <div className={`section-contact absolute inset-0 ${
              currentSection === 'contact' ? 'active' : ''
            }`}>
              <div className="relative h-full">
                <button
                  onClick={handleBackToGallery}
                  className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className="group-hover:-translate-x-1 transition-transform"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{tButtons('back')}</span>
                </button>
                
                <div className="h-full overflow-y-auto">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className={`section-about absolute inset-0 ${
              currentSection === 'about' ? 'active' : ''
            }`}>
              <div className="relative h-full">
                <button
                  onClick={handleBackToGallery}
                  className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className="group-hover:-translate-x-1 transition-transform"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{tButtons('back')}</span>
                </button>
                
                <div className="h-full overflow-y-auto">
                  <AboutUs />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile sections */}
        {isMobile && mobileShowGallery && !mobileShowProjects && !mobileShowDetails && !mobileShowContact && (
          <div className="mobile-gallery fixed inset-0 z-45 pt-16 bg-white">
            <ImageGallerySection
              scrollToProject={handleProjectSelect}
              navigationProps={{ isNavigating: false, targetProject: null }}
              onBackToHero={handleBackToHero}
              onContactClick={() => {
                setMobileShowGallery(false);
                setMobileShowContact(true);
              }}
            />
          </div>
        )}

        {isMobile && mobileShowContact && (
          <div className="mobile-contact fixed inset-0 z-45 pt-16 bg-white">
            <div className="relative h-full">
              <button
                onClick={() => {
                  setMobileShowContact(false);
                  setMobileShowGallery(true);
                }}
                className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
              >
                <svg 
                  width="16" 
                  height="16" 
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
                <span className="text-gray-700 font-medium text-sm">{tButtons('back')}</span>
              </button>
              
              <div className="h-full overflow-y-auto">
                <ContactForm />
              </div>
            </div>
          </div>
        )}

        {isMobile && mobileShowProjects && !mobileShowDetails && (
          <div className="mobile-projects fixed inset-0 z-45 pt-16 pb-20 bg-gray-900">
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
                        <h2 className="text-3xl font-bold mb-3" style={{ color: '#96DED1' }}>
                          {project.title}
                        </h2>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <button
                          onClick={handleMobileDetailsClick}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#191970] hover:bg-[#1e2050] active:bg-[#151751] px-4 py-2 text-white font-medium text-sm transition-colors"
                        >
                          <span>{tButtons('details')}</span>
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
              onProjectSelect={setMobileProject}
            />
          </div>
        )}

        {isMobile && mobileShowDetails && (
          <MobileProjectDetails
            projects={projects}
            currentProject={mobileProject}
            onBack={handleMobileDetailsBack}
          />
        )}

        {isMobile && mobileShowAbout && (
          <div className="mobile-about fixed inset-0 z-45 pt-16 bg-white">
            <div className="relative h-full">
              <button
                onClick={() => {
                  setMobileShowAbout(false);
                  setMobileShowGallery(true);
                }}
                className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
              >
                <svg 
                  width="16" 
                  height="16" 
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
                <span className="text-gray-700 font-medium text-sm">{tButtons('back')}</span>
              </button>
              
              <div className="h-full overflow-y-auto">
                <AboutUs />
              </div>
            </div>
          </div>
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

        /* Initially hide all sections except hero */
        .section-gallery,
        .section-projects,
        .section-contact,
        .section-about {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }

        /* Hero starts visible */
        .section-hero {
          opacity: 1;
          pointer-events: auto;
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
          transform: scale(1);
        }

        .section-hero:not(.active) {
          opacity: 0;
          pointer-events: none;
          transform: scale(1.02);
        }

        .section-gallery {
          transform: translateY(40px);
        }

        .section-projects {
          transform: translateX(40px);
        }

        .section-contact,
        .section-about {
          transform: translateY(40px);
        }

        .section-hero.active,
        .section-gallery.active,
        .section-projects.active,
        .section-contact.active,
        .section-about.active {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translate(0, 0);
        }

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