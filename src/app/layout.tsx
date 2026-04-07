import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../component/layout/header";
import Footer from "../component/layout/footer";
import "../style/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main style={{ minHeight: "88vh" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
