import "./globals.css";
import Header from "./(components)/Header";
import Footer from "./(components)/Footer";
import React from "react";

export const metadata = {
    title: "Saeki Portal",
    description: "Landing Page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" data-theme="lightmodern">
        <body className="bg-base-100 min-h-screen flex flex-col text-base-content">
        <Header />

        <main className="flex-grow flex">
            {children}
        </main>

        <Footer />
        </body>
        </html>
    );
}
