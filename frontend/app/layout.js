import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider.jsx";
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner';
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { DashProvider } from "@/provider/dashContext";
import { BackgroundProvider } from "@/components/main/background/background.jsx";
import { DraggableProvider } from "@/provider/draggableContext";
import UsernamePrompt from '@/components/UsernamePrompt';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Awsome Focus",
  description: "Awsome",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystemdisableTransitionOnChange>
          <DashProvider>
            <BackgroundProvider>
              <DraggableProvider>
                <UsernamePrompt />
                <div className="flex flex-col min-h-screen overflow-hidden">
                  <main className="flex-1 pb-24">
                    {children}
                  </main>
                  <Navbar className="bottom-10" />
                  <Footer />
                </div>
                <Toaster richColors position="top-center" />
              </DraggableProvider>
            </BackgroundProvider>
          </DashProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
