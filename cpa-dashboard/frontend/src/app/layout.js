import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/toast";
import ErrorBoundary from "@/components/ui/error-boundary";
import ReduxProvider from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CPA Dashboard",
    template: "%s | CPA Dashboard",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Comprehensive CPA Dashboard for professional accounting management, bookkeeping, client management, and financial reporting. Streamline your accounting practice with our advanced dashboard.",
  keywords: [
    "CPA Dashboard",
    "Accounting Management",
    "Bookkeeping",
    "Client Management",
    "Financial Reporting",
    "Professional Accounting",
    "CPA Software",
    "Accounting Dashboard",
  ],
  authors: [{ name: "GetOnData Solutions" }],
  creator: "GetOnData Solutions",
  publisher: "GetOnData Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://cpa-dashboard.getondataconsulting.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CPA Dashboard | Professional Accounting Management",
    description:
      "Comprehensive CPA Dashboard for professional accounting management, bookkeeping, client management, and financial reporting.",
    url: "http://cpa-dashboard.getondataconsulting.in",
    siteName: "CPA Dashboard",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "CPA Dashboard - Professional Accounting Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ReduxProvider>
            <ToastProvider>{children}</ToastProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
