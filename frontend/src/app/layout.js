"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  return (
    <html lang="en">
      <body>
        {!isAdminPage && <Navbar />}

        <main>
          {children}
        </main>

        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}