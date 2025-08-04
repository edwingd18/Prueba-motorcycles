import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";

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
          <Sidebar />
          <main className="flex-1 lg:ml-64 overflow-auto">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
          <ConnectionStatus />
        </div>
      </body>
    </html>
  );
}
