import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Architecture
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            About
          </a>
        </nav>

        <Button>Sign In</Button>
      </div>
    </header>
  );
}