"use client";


export default function StorySection() {
  return (
    <section className="pt-20 pb-16 px-5 bg-[#0c0c0c] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cherry/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top label */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px w-12 bg-cherry-light/40" />
          <span className="text-cherry-light text-xs uppercase tracking-[0.25em] font-medium">Our Philosophy</span>
          <div className="h-px w-12 bg-cherry-light/40" />
        </div>

        {/* Main headline */}
        <h2 className="font-serif text-4xl md:text-6xl font-bold text-center leading-tight mb-8">
          Memories fade.{" "}
          <span className="grad-text italic block">Pages don&apos;t.</span>
        </h2>

        <p className="text-white/60 text-lg md:text-xl text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          Your phone&apos;s camera roll is a graveyard of unseen moments. We believe
          your best shots deserve to live — printed, tangible, and permanent.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-6 w-full">
          {[
            { number: "Premium", label: "Hardcover Binding" },
            { number: "Vibrant", label: "True-To-Life Colors" },
            { number: "Glossy", label: "Laminated Pages" },
            { number: "48-72Hrs", label: "Priority\nDispatch" },
          ].map(({ number, label }) => (
            <div key={label} className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-2 sm:p-4 text-center border border-white/10 hover:border-cherry/30 hover:bg-white/10 transition-all flex flex-col items-center justify-center h-full group">
              <div className="text-[12px] min-[375px]:text-[14px] sm:text-lg md:text-3xl font-bold grad-text mb-1 inline-block whitespace-nowrap md:whitespace-normal group-hover:scale-105 transition-transform">{number}</div>
              <div className="text-white/70 text-[8px] min-[375px]:text-[9px] sm:text-xs md:text-base leading-tight uppercase md:normal-case font-medium whitespace-pre-line">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
