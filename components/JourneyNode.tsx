// Va dentro del encabezado de una sección con `lg:pl-20`; `-left-14` lo centra sobre la línea de <ScrollJourney />,
// que es quien lo activa (data-active) cuando el punto que recorre la línea lo alcanza.
export default function JourneyNode({ index }: { index: string }) {
  return (
    <div
      aria-hidden="true"
      data-journey-node=""
      data-active="false"
      className="group/node absolute -top-4 -left-14 hidden -translate-x-1/2 lg:block"
    >
      <span className="absolute top-1/2 left-full h-px w-8 origin-left scale-x-0 bg-gradient-to-r from-violet-500 to-transparent transition-transform duration-500 ease-out-strong group-data-[active=true]/node:scale-x-100 motion-reduce:scale-x-100" />
      <span
        className={
          "relative flex size-12 items-center justify-center rounded-full border bg-zinc-950 font-mono text-xs " +
          "border-white/10 text-zinc-500 transition-[border-color,color,box-shadow,scale] duration-500 ease-out-strong scale-90 " +
          "group-data-[active=true]/node:scale-100 group-data-[active=true]/node:border-violet-500/70 group-data-[active=true]/node:text-white " +
          "group-data-[active=true]/node:shadow-[0_0_0_6px_rgb(139_92_246/0.1),0_0_32px_-4px_rgb(139_92_246/0.7)] " +
          "motion-reduce:scale-100"
        }
      >
        {index}
      </span>
    </div>
  );
}
