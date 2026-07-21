export default function Hero() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center bg-[#09090B] px-6 text-center">
      <h1 className="text-6xl font-bold text-white">
        MindWeave
      </h1>

      <p className="mt-6 max-w-2xl text-xl text-zinc-400">
        Weaving scattered information into intelligent knowledge.
      </p>

      <div className="mt-10 flex gap-4">
        <button className="rounded-xl bg-cyan-500 px-6 py-3 text-black font-semibold hover:bg-cyan-400">
          Generate Intelligence
        </button>

        <button className="rounded-xl border border-zinc-700 px-6 py-3 text-white hover:bg-zinc-900">
          View GitHub
        </button>
      </div>
    </section>
  );
}