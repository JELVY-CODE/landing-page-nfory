import InteractiveNeuralBackground from "@/components/InteractiveNeuralBackground";
import MoonSky from "@/components/MoonSky";

export default function PageBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden [view-transition-name:page-background]">
      <InteractiveNeuralBackground />
      <MoonSky />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(9_9_11/0.25)_0%,transparent_45%,rgb(9_9_11/0.55)_100%)]" />
    </div>
  );
}
