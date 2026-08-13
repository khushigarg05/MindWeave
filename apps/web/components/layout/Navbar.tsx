import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 text-sm md:flex">

          <Link
            href="/chat"
            className="transition-colors hover:text-primary"
          >
            Chat
          </Link>

          <Link
            href="/knowledge"
            className="transition-colors hover:text-primary"
          >
            Knowledge
          </Link>

          <Link
            href="/documents"
            className="transition-colors hover:text-primary"
          >
            Documents
          </Link>

          <Link
            href="/search"
            className="transition-colors hover:text-primary"
          >
            Search
          </Link>

          <Link
            href="/dashboard"
            className="transition-colors hover:text-primary"
          >
            Dashboard
          </Link>

          <Link
            href="/#architecture"
            className="transition-colors hover:text-primary"
          >
            Architecture
          </Link>

          <Link
            href="https://github.com/khushigarg05"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            GitHub
          </Link>

        </nav>

        {/* Action Button */}
        <Link href="/chat">
          <Button>
            Open Workspace
          </Button>
        </Link>

      </div>
    </header>
  );
}