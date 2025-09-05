"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState<'story' | 'team' | 'values' | 'projects' | 'contact'>('story');
  const [countStarted, setCountStarted] = useState(false);
  const [counts, setCounts] = useState({ years: 0, projects: 0, clients: 0, awards: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const t = useTranslations('About');
  const tButtons = useTranslations('Buttons');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Updated team members data - using translation keys
  const teamMembers = [
    {
      name: "Ceyhun Tunalı",
      role: t('team.director'),
      bio: t('team.directorBio')
    },
    {
      name: "Uğur Erhan Candan",
      role: t('team.assistantDirector'),
      bio: t('team.assistantDirectorBio')
    },
    {
      name: "Serem Aşman",
      role: t('team.executiveAssistant'),
      bio: t('team.executiveAssistantBio')
    },
    {
      name: "Viktoriia Noskovets",
      role: t('team.salesRepresentative'),
      bio: t('team.salesRep1Bio')
    },
    {
      name: "Nejdet Derebey",
      role: t('team.salesRepresentative'),
      bio: t('team.salesRep2Bio')
    },
    {
      name: "Mine Durmuş",
      role: t('team.salesRepresentative'),
      bio: t('team.salesRep3Bio')
    },
    {
      name: "Tuğba",
      role: t('team.accounting'),
      bio: t('team.accounting1Bio')
    },
    {
      name: "Berna",
      role: t('team.accounting'),
      bio: t('team.accounting2Bio')
    },
    {
      name: "Dilara",
      role: t('team.accounting'),
      bio: t('team.accounting3Bio')
    },
    {
      name: "Onur",
      role: t('team.siteChief'),
      bio: t('team.siteChiefBio')
    },
    {
      name: "Onur Kaçaröz",
      role: t('team.securityOfficer'),
      bio: t('team.securityOfficerBio')
    },
    {
      name: "Anastasiia",
      role: t('team.officeManager'),
      bio: t('team.officeManagerBio')
    },
    {
      name: "Tekin Dabaj",
      role: t('team.itUnit'),
      bio: t('team.itUnitBio')
    }
  ];

  // Values data using translations
  const values = [
    {
      icon: "🏆",
      title: t('values.excellence'),
      description: t('values.excellenceDesc')
    },
    {
      icon: "🤝",
      title: t('values.trust'),
      description: t('values.trustDesc')
    },
    {
      icon: "💡",
      title: t('values.innovation'),
      description: t('values.innovationDesc')
    },
    {
      icon: "⏰",
      title: t('values.delivery'),
      description: t('values.deliveryDesc')
    }
  ];

  // Timeline data using translations
  const timelineData = [
    { 
      year: "1976", 
      title: t('timeline.1976.title'), 
      description: t('timeline.1976.description') 
    },
    { 
      year: "1995", 
      title: t('timeline.1995.title'), 
      description: t('timeline.1995.description') 
    },
    { 
      year: "2005", 
      title: t('timeline.2005.title'), 
      description: t('timeline.2005.description') 
    },
    { 
      year: "2015", 
      title: t('timeline.2015.title'), 
      description: t('timeline.2015.description') 
    },
    { 
      year: "2024", 
      title: t('timeline.2024.title'), 
      description: t('timeline.2024.description') 
    }
  ];

  // Animate counter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countStarted) {
          setCountStarted(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [countStarted]);

  const animateCounters = () => {
    const targets = { years: 40, projects: 150, clients: 500, awards: 25 };
    const duration = 2000;
    const increment = 20;

    const intervals: NodeJS.Timeout[] = [];
    
    Object.keys(targets).forEach((key) => {
      const target = targets[key as keyof typeof targets];
      const stepValue = target / (duration / increment);
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);

      intervals.push(interval);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Video Background */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/video-poster.jpg"
          >
            <source 
              src={isMobile ? "/video-mobile.mp4" : "/video-compressed.mp4"} 
              type="video/mp4" 
            />
          </video>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#191970]/60 to-black/60" />
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slideUp">
              {t.rich('hero.title', {
                trust: (chunks) => <span style={{ color: '#96DED1' }}>{chunks}</span>,
                experience: (chunks) => <span style={{ color: '#96DED1' }}>{chunks}</span>
              })}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 animate-fadeIn animation-delay-200">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#191970] mb-2">
                {counts.years}+
              </div>
              <div className="text-gray-600 font-medium">{t('stats.yearsExperience')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#191970] mb-2">
                {counts.projects}+
              </div>
              <div className="text-gray-600 font-medium">{t('stats.completedProjects')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#191970] mb-2">
                {counts.clients}+
              </div>
              <div className="text-gray-600 font-medium">{t('stats.happyClients')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#191970] mb-2">
                {counts.awards}+
              </div>
              <div className="text-gray-600 font-medium">{t('stats.awardsAndCertificates')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-full shadow-lg p-1">
              {(['story', 'team', 'values'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-[#191970] text-white'
                      : 'text-gray-700 hover:text-[#191970]'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  {t('story.title')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      {t('story.paragraph1')}
                    </p>
                    <p className="leading-relaxed">
                      {t('story.paragraph2')}
                    </p>
                    <p className="leading-relaxed">
                      {t('story.paragraph3')}
                    </p>
                  </div>
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src="/company-history.jpg"
                      alt="Company History"
                      fill
                      style={{ objectFit: "cover" }}
                      className="hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab - Updated with new members */}
            {activeTab === 'team' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  {t('team.title')}
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="group relative bg-gray-50 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[#191970] to-[#4169E1] flex items-center justify-center text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
                        {member.name}
                      </h3>
                      <p className="text-[#191970] font-medium text-sm text-center mb-2">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-xs text-center">
                        {member.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Values Tab */}
            {activeTab === 'values' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  {t('values.title')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-[#191970]/5 transition-colors"
                    >
                      <div className="text-4xl">{value.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('timeline.title')}
          </h2>
          
          {/* Mobile Timeline */}
          <div className="block md:hidden space-y-4">
            {timelineData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-[#191970]">
                <span className="text-[#191970] font-bold text-lg">{item.year}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#191970]/20"></div>
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center mb-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="w-1/2"></div>
                <div className="relative">
                  <div className="w-4 h-4 bg-[#191970] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'}`}>
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <span className="text-[#191970] font-bold text-lg">{item.year}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#191970] to-[#4169E1]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setActiveTab('projects');
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#191970] px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              {t('cta.viewProjects')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M13 7l5 5-5 5M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
              }}
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#191970] transition-all"
            >
              {t('cta.contact')}
            </button>
          </div>
        </div>
      </section>

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

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}