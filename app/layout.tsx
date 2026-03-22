import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { instrumentSerif } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Breadcrumbs",
  description: "Track what you explore. Capture what you learn.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Breadcrumbs",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`h-full ${instrumentSerif.variable}`}>
        <head>
          <meta name="theme-color" content="#78350f" />
          <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        </head>
        <body className="min-h-full">
          <ConvexClientProvider>
            {children}
            <ServiceWorkerRegister />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
