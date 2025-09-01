"use client";
import Image from "next/image";
import { useEffect } from "react";

interface ImageGallerySectionProps {
  scrollToProject: (projectId: number) => void;
  navigationProps?: {
    isNavigating: boolean;
    targetProject: number | null;
  };
}

export default function ImageGallerySection({
  scrollToProject,
  navigationProps,
}: ImageGallerySectionProps) {
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
    if (navigationProps?.isNavigating) {
      // During navigation, apply direct highlighting to target project
      projects.forEach((project) => {
        const titleCard = document.querySelector(
          `.title-card-${project.id} .title-content`
        ) as HTMLElement;
        if (titleCard) {
          if (project.id === navigationProps.targetProject) {
            // Apply highlight to target project
            titleCard.style.backgroundColor = "#ea580c";
            titleCard.style.color = "white";
            titleCard.style.transform = "scale(1.02)";
          } else {
            // Remove highlight from other projects
            titleCard.style.backgroundColor = "transparent";
            titleCard.style.color = "white";
            titleCard.style.transform = "scale(1)";
          }
        }
      });

      // Clean up after navigation
      setTimeout(() => {
        projects.forEach((project) => {
          const titleCard = document.querySelector(
            `.title-card-${project.id} .title-content`
          ) as HTMLElement;
          if (titleCard) {
            titleCard.style.backgroundColor = "";
            titleCard.style.color = "";
            titleCard.style.transform = "";
          }
        });
      }, 900);
    }
  }, [navigationProps?.isNavigating, navigationProps?.targetProject]);

  return (
    <>
      {/* 55–75%: 4 görsel + 4 title grid olarak gelir */}
      <div className="image-gallery fixed top-0 left-0 w-full h-screen z-40 pointer-events-none">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`image-${project.id} absolute overflow-hidden`}
          >
            <div className="relative w-full h-full">
              <Image
                src={project.image}
                alt={`İnşaat Projesi ${project.id}`}
                fill
                priority={index === 0}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Başlık kartları */}
      <div className="transitioning-titles fixed top-0 left-0 w-full h-screen z-47 pointer-events-auto">
        {projects.map((project) => (
          <div key={project.id} className={`title-card-${project.id} absolute`}>
            <div
              className="title-content px-4 py-2 rounded-lg transition-all duration-300 hover:bg-orange-500 hover:text-white cursor-pointer flex flex-col items-center text-center"
              onClick={() => scrollToProject(project.id)}
            >
              <h3 className="title-text text-white font-semibold text-lg">
                {project.title}
              </h3>
              <p className="title-description text-sm text-gray-200 leading-relaxed mt-2">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Görsel aralıkları: 55–75% görünür, 75–80% header'a akarken sönmeye başlar, 80%'de yok */
        .image-1 {
          animation: image-1-lifecycle linear both;
          animation-timeline: scroll(root);
          animation-range: 55% 80%;
        }
        .image-2 {
          animation: image-2-lifecycle linear both;
          animation-timeline: scroll(root);
          animation-range: 56% 80%;
        }
        .image-3 {
          animation: image-3-lifecycle linear both;
          animation-timeline: scroll(root);
          animation-range: 57% 80%;
        }
        .image-4 {
          animation: image-4-lifecycle linear both;
          animation-timeline: scroll(root);
          animation-range: 58% 80%;
        }

        /* Başlık kartları: 55–75% gridde görünür, 75–80% header pozisyonuna taşınır, 80%'de sabit */
        .title-card-1 {
          animation: title-1-to-header linear both;
          animation-timeline: scroll(root);
          animation-range: 55% 80%;
        }
        .title-card-2 {
          animation: title-2-to-header linear both;
          animation-timeline: scroll(root);
          animation-range: 56% 80%;
        }
        .title-card-3 {
          animation: title-3-to-header linear both;
          animation-timeline: scroll(root);
          animation-range: 57% 80%;
        }
        .title-card-4 {
          animation: title-4-to-header linear both;
          animation-timeline: scroll(root);
          animation-range: 58% 80%;
        }

        .title-description {
          animation: description-fade linear both;
          animation-timeline: scroll(root);
          animation-range: 70% 75%;
        }

        /* 4 görseli 4 kolon gibi konumlayan keyframe'ler (desktop) */
        @keyframes image-1-lifecycle {
          0% {
            opacity: 0;
            top: 100vh;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            width: 200px;
            height: 120px;
          }
          25% {
            opacity: 1;
            top: 90px;
            left: 0.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          80% {
            opacity: 1;
            top: 90px;
            left: 0.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          100% {
            opacity: 0;
            top: 90px;
            left: 0.5%;
            transform: translateY(-100px);
            width: 24%;
            height: 450px;
          }
        }
        @keyframes image-2-lifecycle {
          0% {
            opacity: 0;
            top: 100vh;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            width: 200px;
            height: 120px;
          }
          25% {
            opacity: 1;
            top: 90px;
            left: 25.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          80% {
            opacity: 1;
            top: 90px;
            left: 25.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          100% {
            opacity: 0;
            top: 90px;
            left: 25.5%;
            transform: translateY(-100px);
            width: 24%;
            height: 450px;
          }
        }
        @keyframes image-3-lifecycle {
          0% {
            opacity: 0;
            top: 100vh;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            width: 200px;
            height: 120px;
          }
          25% {
            opacity: 1;
            top: 90px;
            left: 50.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          80% {
            opacity: 1;
            top: 90px;
            left: 50.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          100% {
            opacity: 0;
            top: 90px;
            left: 50.5%;
            transform: translateY(-100px);
            width: 24%;
            height: 450px;
          }
        }
        @keyframes image-4-lifecycle {
          0% {
            opacity: 0;
            top: 100vh;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            width: 200px;
            height: 120px;
          }
          25% {
            opacity: 1;
            top: 90px;
            left: 75.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          80% {
            opacity: 1;
            top: 90px;
            left: 75.5%;
            transform: translate(0, 0);
            width: 24%;
            height: 450px;
          }
          100% {
            opacity: 0;
            top: 90px;
            left: 75.5%;
            transform: translateY(-100px);
            width: 24%;
            height: 450px;
          }
        }

        /* Başlıkları gridden header'a taşıyan keyframe'ler */
        @keyframes title-1-to-header {
          0% {
            opacity: 0;
            top: 560px;
            left: 0.5%;
            width: 24%;
            transform: translateY(50px);
          }
          30% {
            opacity: 1;
            top: 560px;
            left: 0.5%;
            width: 24%;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            top: 560px;
            left: 0.5%;
            width: 24%;
          }
          100% {
            opacity: 1;
            top: 90px;
            left: 5%;
            width: 22%;
          }
        }
        @keyframes title-2-to-header {
          0% {
            opacity: 0;
            top: 560px;
            left: 25.5%;
            width: 24%;
            transform: translateY(50px);
          }
          30% {
            opacity: 1;
            top: 560px;
            left: 25.5%;
            width: 24%;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            top: 560px;
            left: 25.5%;
            width: 24%;
          }
          100% {
            opacity: 1;
            top: 90px;
            left: 27.5%;
            width: 22%;
          }
        }
        @keyframes title-3-to-header {
          0% {
            opacity: 0;
            top: 560px;
            left: 50.5%;
            width: 24%;
            transform: translateY(50px);
          }
          30% {
            opacity: 1;
            top: 560px;
            left: 50.5%;
            width: 24%;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            top: 560px;
            left: 50.5%;
            width: 24%;
          }
          100% {
            opacity: 1;
            top: 90px;
            left: 50.5%;
            width: 22%;
          }
        }
        @keyframes title-4-to-header {
          0% {
            opacity: 0;
            top: 560px;
            left: 75.5%;
            width: 24%;
            transform: translateY(50px);
          }
          30% {
            opacity: 1;
            top: 560px;
            left: 75.5%;
            width: 24%;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            top: 560px;
            left: 75.5%;
            width: 24%;
          }
          100% {
            opacity: 1;
            top: 90px;
            left: 73%;
            width: 22%;
          }
        }

        /* Header title highlighting during featured project story */
        .title-card-1 .title-content {
          animation: title-card-1-highlight linear both;
          animation-timeline: scroll(root);
          animation-range: 82% 86%;
        }
        .title-card-2 .title-content {
          animation: title-card-2-highlight linear both;
          animation-timeline: scroll(root);
          animation-range: 86% 90%;
        }
        .title-card-3 .title-content {
          animation: title-card-3-highlight linear both;
          animation-timeline: scroll(root);
          animation-range: 90% 94%;
        }
        .title-card-4 .title-content {
          animation: title-card-4-highlight linear both;
          animation-timeline: scroll(root);
          animation-range: 94% 98%;
        }

        /* New highlight keyframes for header titles */
        @keyframes title-card-1-highlight {
          0% {
            background-color: transparent;
            color: white;
          }
          10% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          90% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          100% {
            background-color: transparent;
            color: white;
            transform: scale(1);
          }
        }
        @keyframes title-card-2-highlight {
          0% {
            background-color: transparent;
            color: white;
          }
          10% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          90% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          100% {
            background-color: transparent;
            color: white;
            transform: scale(1);
          }
        }
        @keyframes title-card-3-highlight {
          0% {
            background-color: transparent;
            color: white;
          }
          10% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          90% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          100% {
            background-color: transparent;
            color: white;
            transform: scale(1);
          }
        }
        @keyframes title-card-4-highlight {
          0% {
            background-color: transparent;
            color: white;
          }
          10% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          90% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
          100% {
            background-color: #ea580c;
            color: white;
            transform: scale(1.02);
          }
        }

        @keyframes description-fade {
          0% {
            opacity: 1;
            max-height: 100px;
          }
          100% {
            opacity: 0;
            max-height: 0;
          }
        }

        /* Disable highlight animations during navigation */
        body.direct-navigation .title-card-1 .title-content,
        body.direct-navigation .title-card-2 .title-content,
        body.direct-navigation .title-card-3 .title-content,
        body.direct-navigation .title-card-4 .title-content {
          animation: none !important;
        }

        /* Mobil/Tablet media query'lerini istersen geri ekleyebiliriz; şu an asıl sıralama için masaüstü netlik veriyor. */
      `}</style>
    </>
  );
}
