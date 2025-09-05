import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["tr", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export default getRequestConfig(async ({ locale }) => {
  // 'locale' her zaman string olsun (TS açısından): önce doğrula/daralt
  const activeLocale: Locale =
    locale && locales.includes(locale as Locale)
      ? (locale as Locale)
      : defaultLocale; // İstersen burada notFound() da tercih edebilirsin

  try {
    const messages = (await import(`../../messages/${activeLocale}.json`)).default;
    // ÖNEMLİ: 'locale' artık kesin string (Locale) tipinde
    return { locale: activeLocale, messages };
  } catch (e) {
    // Mesaj dosyası bulunamazsa 404 ver
    notFound();
  }
});
