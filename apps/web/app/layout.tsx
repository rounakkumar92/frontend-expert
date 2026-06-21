import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frontendexpert.com"),
  title: {
    template: "%s | Frontend Expert",
    default: "Frontend Expert | Master Modern Web Development",
  },
  description: "Empelling developers with premium, structured, hands-on learning resources for master class frontend engineering.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "feed.xml", title: "Frontend Expert RSS Feed" },
      ],
    },
  },
  openGraph: {
    title: "Frontend Expert",
    description: "Empelling developers with premium, structured, hands-on learning resources for master class frontend engineering.",
    url: "https://frontendexpert.com",
    siteName: "Frontend Expert",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Expert",
    description: "Empelling developers with premium, structured, hands-on learning resources for master class frontend engineering.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Frontend Expert",
  "url": "https://frontendexpert.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://frontendexpert.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
