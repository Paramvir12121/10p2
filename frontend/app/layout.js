import "./globals.css";
import Head from "next/head";

export const metadata = {
  title: "10p2",
  description: "The better pomodoro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>{children}</body>
    </html>
  );
}
