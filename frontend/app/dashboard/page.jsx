"use client"; // Ensure Dashboard is treated as a Client Component

import dynamic from "next/dynamic";

// Dynamically import SecondBackground with SSR disabled
const SecondBackground = dynamic(() => import("@/components/background/SecondBackground"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <SecondBackground />
    </div>
  );
}
