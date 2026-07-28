import Sidebar from "./Sidebar";
import Chat from "./Chat";

export default function ChatLayout() {
  return (
    <section className="flex h-screen border-t border-zinc-800">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </section>
  );
}