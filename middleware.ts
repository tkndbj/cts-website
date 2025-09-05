import createMiddleware from "next-intl/middleware";

// Basit ve sağlam ayar:
export default createMiddleware({
  locales: ["tr", "en", "ru"],
  defaultLocale: "tr",
  localePrefix: "as-needed",   // => / → /tr olarak görünür şekilde yönlendir
  localeDetection: false
});

export const config = {
  // Statikleri ve API'yi dışarıda bırakan geniş desen de kullanabilirdik ama bu yeterli:
  matcher: ["/", "/(tr|en|ru)/:path*"]
};
