export default function Loading() {
  return (
    <main className="bg-[#050505] text-[#F9F1D8] min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-3 bg-white/10 rounded-full w-32 mb-3 animate-pulse" />
          <div className="h-12 bg-white/10 rounded-full w-64 mb-3 animate-pulse" />
          <div className="h-4 bg-white/10 rounded-full w-96 animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-20 bg-white/10 rounded-full animate-pulse" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-white/10 rounded-full w-2/3" />
                <div className="h-3 bg-white/10 rounded-full w-1/3" />
                <div className="h-3 bg-white/10 rounded-full w-full" />
                <div className="h-3 bg-white/10 rounded-full w-4/5" />
                <div className="flex gap-2 mt-4">
                  <div className="h-9 bg-white/10 rounded-xl flex-1" />
                  <div className="h-9 bg-white/10 rounded-xl flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
