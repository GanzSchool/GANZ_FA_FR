import "./globals.css";

export const metadata = {
  title: "GANZ FA",
  description: "Diák belépés",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}