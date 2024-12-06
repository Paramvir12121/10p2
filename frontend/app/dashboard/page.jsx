import Link from "next/link"
import AnimatedBackground from "@/components/background/AnimatedBackground"
import SecondBackground from "@/components/background/SecondBackground"

export default function Dashboard() {
    return(
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* <AnimatedBackground /> */}
      <SecondBackground />
      
    </div>
    )
}