import {
  Brain,
  Search,
  Database,
  Bot,
  User,
  FileText,
} from "lucide-react";

function Node({
  icon: Icon,
  title,
  color,
}: {
  icon: any;
  title: string;
  color: string;
}) {
  return (
    <div
      className={`flex h-28 w-52 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition-all duration-300 hover:scale-105 ${color}`}
    >
      <Icon className="mb-3 h-8 w-8" />
      <p className="font-semibold">{title}</p>
    </div>
  );
}

export default function KnowledgeFlow() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">

      <div className="mb-20 text-center">

        <h2 className="text-5xl font-bold">
          How MindWeave Thinks
        </h2>

        <p className="mt-5 text-zinc-400">
          Every response passes through an intelligent AI pipeline.
        </p>

      </div>

      <div className="flex flex-col items-center gap-10">

        <Node
          icon={User}
          title="User Query"
          color="text-cyan-400"
        />

        <div className="h-12 w-1 rounded bg-cyan-500" />

        <Node
          icon={Brain}
          title="Planner Agent"
          color="text-violet-400"
        />

        <div className="flex items-center gap-20">

          <div className="flex flex-col items-center">

            <div className="h-10 w-1 rounded bg-zinc-700" />

            <Node
              icon={Search}
              title="Research"
              color="text-green-400"
            />

          </div>

          <div className="flex flex-col items-center">

            <div className="h-10 w-1 rounded bg-zinc-700" />

            <Node
              icon={Database}
              title="Memory"
              color="text-orange-400"
            />

          </div>

        </div>

        <div className="h-12 w-1 rounded bg-cyan-500" />

        <Node
          icon={Bot}
          title="Claude AI"
          color="text-pink-400"
        />

        <div className="h-12 w-1 rounded bg-cyan-500" />

        <Node
          icon={FileText}
          title="Final Response"
          color="text-yellow-400"
        />

      </div>

    </section>
  );
}