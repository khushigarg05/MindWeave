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
        <nav className="hidden items-center gap-8 text-sm md:flex">

          <Link
            href="/#features"
            className="transition-colors hover:text-primary"
          >
            Features
          </Link>

          <Link
            href="/#architecture"
            className="transition-colors hover:text-primary"
          >
            Architecture
          </Link>

          <Link
            href="/chat"
            className="transition-colors hover:text-primary"
          >
            Workspace
          </Link>

          <Link
            href="https://github.com/khushigarg05"
            target="_blank"
            className="transition-colors hover:text-primary"
          >
            GitHub
          </Link>

          <Link
            href="/#about"
            className="transition-colors hover:text-primary"
          >
            About
          </Link>

        </nav>


        {/* Action Button */}
        <Link href="/chat">
          <Button>
            Start Research
          </Button>
        </Link>

      </div>
    </header>
  );
}