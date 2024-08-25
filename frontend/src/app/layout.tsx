import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./Providers";
import Head from "next/head";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orare | Descubre la paz a través de la oración.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <Head>
          {/* Agrega el meta tag para el viewport aquí */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        </Head>
        <body className={inter.className}>{children}</body>
        
      </html>
    </Providers>
  );
}


// npm install react-hot-toast 