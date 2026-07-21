import { Button } from "@/components/ui/button";
import AIPanel from "./AIPanel";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute right-20 top-40 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* LEFT COLUMN */}

        <div className="text-center lg:text-left">

          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            AI Knowledge Orchestration Platform
          </span>

          <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Weaving scattered information into
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              {" "}
              intelligent knowledge
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
            MindWeave combines AI agents, semantic memory,
            vector search, automation and intelligent reasoning
            into one unified workspace.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Button size="lg">
              Start Research
            </Button>

            <Button size="lg" variant="outline">
              View Architecture
            </Button>

          </div>
    

        </div>

        {/* RIGHT COLUMN */}

        <AIPanel />

      </div>

    </section>
  );
}