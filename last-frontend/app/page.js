import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="dashboard-content"> 
      Home
      <br />
      <Link href="/dashboard">
      <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
