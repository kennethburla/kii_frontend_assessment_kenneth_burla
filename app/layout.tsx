import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryProvider } from "./providers/QueryClientProvider";
import { WalletProvider } from "./providers/WalletProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${montserrat.className} font-monserrat bg-background antialiased text-white  bg-[radial-gradient(circle at top right,_rgba(220,220,255,0.2)_0%,_transparent_30%)]`}
      >
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <WalletProvider>{children}</WalletProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
