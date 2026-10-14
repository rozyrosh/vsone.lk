import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Environment } from "@/components/environment";
import { MotionProvider } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VS One. Enterprise ICT hardware, allocated to Sri Lankan partners.",
    template: "%s · VS One",
  },
  description:
    "VS One supplies 200+ partners across Sri Lanka with Dell, Cisco, HPE, Lenovo, Fortinet and APC hardware, island-wide logistics in 24 to 48 hours, and the country's first ERP partner portal.",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0f1115"/><path d="M16 5v16" stroke="#c9cfd9" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="24" r="3.5" fill="#bb001e"/></svg>`,
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f6f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="font-body-md text-on-surface antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-full">
          Skip to content
        </a>
        <Environment />
        <MotionProvider />
        <div className="page">
          <SiteHeader />
          <main id="content" tabIndex={-1} className="w-full pt-16 min-h-screen outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
