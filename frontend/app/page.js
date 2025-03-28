import Image from "next/image";
import Timer from "@/components/main/timer/DoubleTimer";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Focus Dashboard</h1>
      <div className="flex justify-center">
        <Timer />
      </div>
    </div>
  );
}
