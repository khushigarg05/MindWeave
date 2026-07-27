import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ChatPanel from "@/components/dashboard/ChatPanel";

export default function Dashboard() {
  return (
    <main className="flex h-screen">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <ChatPanel />

      </div>

    </main>
  );
}