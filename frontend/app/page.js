import Link from "next/link";

export default function Home() {
  return (
    <div>
      Entry Page
      <br />
      <Link href="/dashboard">
        Dashboard
      </Link>
    </div>
  );
}
