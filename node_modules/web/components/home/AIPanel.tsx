import {
  Brain,
  Search,
  Bot,
  Database,
  HardDrive,
  Workflow,
} from "lucide-react";

const agents = [
  {
    name: "Planner",
    status: "Running",
    icon: Brain,
  },
  {
    name: "Researcher",
    status: "Completed",
    icon: Search,
  },
  {
    name: "Claude",
    status: "Thinking...",
    icon: Bot,
  },
  {
    name: "Qdrant",
    status: "Connected",
    icon: Database,
  },
  {
    name: "Memory",
    status: "Synced",
    icon: HardDrive,
  },
  {
    name: "n8n Workflow",
    status: "Active",
    icon: Workflow,
  },
];

export default function AIPanel() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur">

      <h2 className="mb-6 text-xl font-bold">
        🧠 AI Orchestration
      </h2>

      <div className="space-y-4">

        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 transition-all hover:border-cyan-500 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">

                <Icon className="h-5 w-5 text-cyan-400" />

                <div>

                  <p className="font-medium">
                    {agent.name}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {agent.status}
                  </p>

                </div>

              </div>

              <div className="h-3 w-3 rounded-full bg-green-400" />

            </div>
          );
        })}

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">
          <span>Current Task</span>
          <span>84%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

          <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />

        </div>

      </div>

    </div>
  );
}