import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import KnowledgeFlow from "@/components/home/KnowledgeFlow";
import ChatLayout from "@/components/chat/ChatLayout";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <KnowledgeFlow />
      <ChatLayout />
    </>
  );
}