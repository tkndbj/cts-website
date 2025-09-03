"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      image: "/1.jpg",
      title: "Four Seasons Life",
      description:
        "Çağdaş tasarım çözümleri ile geleceğin yapılarını inşa ediyoruz",
    },
    {
      id: 2,
      image: "/2.jpg",
      title: "The Sign",
      description: "Uzman ekibimiz ile her detayda mükemmellik arayışı",
    },
    {
      id: 3,
      image: "/3.jpg",
      title: "Aurora Bay",
      description: "Çevre dostu yapılar ile doğaya saygılı inşaat",
    },
    {
      id: 4,
      image: "/4.jpg",
      title: "Carob Hill",
      description: "Zamanında teslimat ve müşteri memnuniyeti odaklı hizmet",
    },
  ];

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <>
      {/* Gallery Grid - adjusted for persistent header */}
      <div className="fixed inset-0 pt-20 px-4 pb-8 flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <h2 className={`text-center text-4xl md:text-5xl font-bold text-white mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Projelerimiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`gallery-card relative group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
                onClick={() => scrollToProject(project.id)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative h-[400px] md:h-[450px] overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src={project.image}
                    alt={`İnşaat Projesi ${project.id}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className={`transition-transform duration-700 ${
                      hoveredProject === project.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-70'
                  }`} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-xl mb-2">
                      {project.title}
                    </h3>
                    <p className={`text-sm text-gray-200 leading-relaxed transition-all duration-500 ${
                      hoveredProject === project.id 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}>
                      {project.description}
                    </p>
                    
                    <div className={`mt-4 inline-flex items-center text-orange-400 font-medium transition-all duration-500 ${
                      hoveredProject === project.id 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}>
                      <span>Detayları Gör</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="ml-2"
                      >
                        <path
                          d="M9 18l6-6-6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-card {
          transform: perspective(1000px);
        }
        
        .gallery-card:hover {
          transform: perspective(1000px) rotateY(-2deg) scale(1.02);
        }
        
        .gallery-card:nth-child(even):hover {
          transform: perspective(1000px) rotateY(2deg) scale(1.02);
        }
      `}</style>
    </>
  );
}