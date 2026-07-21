export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-[#09090B]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="text-2xl font-bold text-white">
          🧠 MindWeave
        </div>

        <div className="hidden gap-8 text-zinc-300 md:flex">
          <a href="#" className="hover:text-cyan-400">Features</a>
          <a href="#" className="hover:text-cyan-400">Docs</a>
          <a href="#" className="hover:text-cyan-400">GitHub</a>
        </div>

        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Sign In
        </button>
      </div>
    </nav>
  );
}