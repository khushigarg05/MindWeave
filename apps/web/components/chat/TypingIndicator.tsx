export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl bg-zinc-800 px-4 py-3">
        <div className="flex gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}