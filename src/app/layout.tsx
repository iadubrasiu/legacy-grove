import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Árbol de Memorias",
  description: "Preserva tus recuerdos familiares",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF8C00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#121212] text-white overflow-hidden h-screen`}>
        <div className="flex flex-col h-full max-w-md mx-auto relative bg-[#121212] shadow-2xl border-x border-gray-800">
          <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
            {children}
          </main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}
