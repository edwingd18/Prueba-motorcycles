import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import ClientOnly from "@/components/ClientOnly";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Motorcycle Store",
  description: "Sistema de gestión de motocicletas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-white`}>
        <div className="flex h-screen">
          <ClientOnly>
            <Sidebar />
          </ClientOnly>
          <main className="flex-1 lg:ml-64 overflow-auto">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
          <ClientOnly>
            <ConnectionStatus />
          </ClientOnly>
        </div>
      </body>
    </html>
  );
}
