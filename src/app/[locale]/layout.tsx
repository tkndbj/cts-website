import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ceyhun Tunalı & Sons",
  description: "Ceyhun Tunalı & Sons"
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  // DİKKAT: Promise olarak bırakıyoruz ki validator ile eşleşsin
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params; // <- Promise'ten çek
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
