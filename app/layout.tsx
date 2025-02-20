import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Beat-Jam",
    template: "%s | Beat-Jam",
  },
  description: "Best way to listen music with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          <Toaster richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
