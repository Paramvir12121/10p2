import "./globals.css";
import Header from "@/components/layout/Header";
import {Toaster} from "@/components/ui/toaster";



export const metadata = {
  title: "10p2",
  description: "The Better Pomodoro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <body>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
