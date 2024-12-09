import CozyBackground from "@/components/background/CozyBackground";

export default function dashboard() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <CozyBackground />
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        Hello
      </div>
    </div>
    
   
  );
}