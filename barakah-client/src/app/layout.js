import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Barakah",
  description: "Islamic Clock and Canvas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <AuthProvider>
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
