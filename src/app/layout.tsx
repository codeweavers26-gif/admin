import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../component/layout/header";
import Footer from "../component/layout/footer";
import "../style/globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Admin Panel",
//   description: "Next.js Admin Panel",
// };

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
    // <html lang="en">
    //   <body>
    //     <div className="layout">
    //       <aside className="sidebar">
    //         {/* Sidebar */}
    //         <h3 className="logo">SHOPPER</h3>

    //         <div className="menu">
    //           <button className="menu-item">🛒 Add Product</button>
    //           <button className="menu-item">📦 Product List</button>
    //         </div>
    //       </aside>

    //       <main className="content">
    //         {children}
    //       </main>
    //     </div>
    //   </body>
    // </html>
  );
}
