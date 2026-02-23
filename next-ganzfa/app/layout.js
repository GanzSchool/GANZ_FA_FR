import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GANZ FA - Diakportol",
  description: "GANZ iskola diak belepes es adatok",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
