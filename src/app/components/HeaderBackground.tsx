"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderBackgroundProps {
  onLogoClick?: () => void;
  onProjectsClick?: () => void;
  onContactClick?: () => void;
  onAboutClick?: () => void;
}

export default function HeaderBackground({ 
  onLogoClick, 
  onProjectsClick, 
  onContactClick,
  onAboutClick
}: HeaderBackgroundProps) {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Get the current pathname without the locale
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale path
    if (langCode === 'tr') {
      // Turkish doesn't need prefix with "as-needed" setting
      router.push(currentPathWithoutLocale);
    } else {
      router.push(`/${langCode}${currentPathWithoutLocale}`);
    }
    
    setIsLangMenuOpen(false);
  };

  return (
    <div 
      className="fixed top-0 left-0 z-50 w-full h-20 backdrop-blur-lg border-b"
      style={{
        backgroundColor: '#191970',
        borderColor: 'rgba(235, 228, 215, 0.3)',
        fontFamily: 'Figtree, sans-serif'
      }}
    >
      <div className="h-full flex items-center justify-between px-8 relative">
        <div
          className="cursor-pointer"
          onClick={onLogoClick}
        >
          <h1 className="text-2xl font-bold text-white hover:text-blue-600 transition-colors">
            Ceyhun Tunalı
            <span 
              className="ml-2 hover:opacity-80 transition-opacity"
              style={{ color: '#96DED1' }}
            >
              &amp; Sons
            </span>
          </h1>
        </div>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
          <button
            onClick={onAboutClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            {t('about')}
          </button>
          <button
            onClick={onProjectsClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            {t('ourProjects')}
          </button>
          <button
            onClick={onContactClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            {t('contact')}
          </button>
        </nav>

        {/* Language Selector */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={t('selectLanguage')}
          >
            <span className="text-xl">{currentLang.flag}</span>
            <span className="text-white font-medium">{currentLang.code.toUpperCase()}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className={`text-white transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-xl overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                    locale === lang.code ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-gray-700">{lang.name}</span>
                  {locale === lang.code && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="ml-auto text-green-500"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}