import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import DocumentStatus from "../components/DocumentStatus";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAG Básico - Sistema de Consultas PDF",
  description: "Sistema básico de RAG para consultas sobre documentos PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen`}
      >
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                RAG Básico
              </Link>
              <div className="flex items-center space-x-6">
                {/* <DocumentStatus /> */}
                <div className="flex space-x-6">
                  <Link
                    href="/upload"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Subir PDF
                  </Link>
                  <Link
                    href="/chat"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Chat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </body>
    </html>
  );
}
