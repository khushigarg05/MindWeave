import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import KnowledgeFlow from "@/components/home/KnowledgeFlow";
import Chat from "@/components/chat/Chat";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <KnowledgeFlow />
      <Chat />
    </>
  );
}