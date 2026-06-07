export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 right-0 w-[800px] h-[600px] bg-orange-200/40 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-amber-100/60 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-[90px]" />
    </div>
  );
}
