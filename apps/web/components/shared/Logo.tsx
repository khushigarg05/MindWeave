export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500" />
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          MindWeave
        </h1>

        <p className="text-xs text-zinc-500">
          AI Knowledge OS
        </p>
      </div>
    </div>
  );
}