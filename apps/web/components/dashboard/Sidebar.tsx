import {
  LayoutDashboard,
  MessageSquare,
  Database,
  Workflow,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Chat", icon: MessageSquare },
  { name: "Knowledge", icon: Database },
  { name: "Automation", icon: Workflow },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950 p-6">

      <h1 className="mb-10 text-2xl font-bold">
        🧠 MindWeave
      </h1>

      <div className="space-y-3">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-zinc-900"
            >
              <Icon className="h-5 w-5" />

              {item.name}
            </button>
          );
        })}

      </div>

    </aside>
  );
}