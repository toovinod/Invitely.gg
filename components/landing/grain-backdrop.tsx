export function GrainBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "#101010" }}
    >
      {/*<div
        className="absolute"
        style={{
          right: "-8%",
          bottom: "-15%",
          width: "70vw",
          height: "70vh",
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
        }}
      />*/}

      {/*<div
        className="absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(60% 100% at 65% 100%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
        }}
      />*/}

      {/*<div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 55%)",
        }}
      />*/}

      <div className="absolute inset-[-10%] bg-grain opacity-[0.30] mix-blend-screen animate-grain" />

      <div className="absolute inset-0 bg-grain-fine opacity-[0.18] mix-blend-screen" />
    </div>
  );
}
