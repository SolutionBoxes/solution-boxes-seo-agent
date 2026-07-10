import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";

export default function Home() {
  return (
    <div className="flex h-dvh w-full flex-col">
      <Header />
      <ChatPanel />
    </div>
  );
}
