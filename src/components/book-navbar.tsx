import React from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onApplyClick: () => void;
}

export const BookNavbar = ({ onApplyClick }: NavbarProps) => {
  const links = [
    { label: "Programs", id: "programs" },
    { label: "Campuses", id: "campuses" },
    { label: "Admissions", id: "admissions" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      data-testid="navbar"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[min(94vw,920px)]"
    >
      <nav
        className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-4"
        aria-label="Primary"
      >
        <a href="#cover" data-testid="navbar-logo" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-full bg-forest text-paper flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" strokeWidth={2.2} />
          </span>
          <span className="font-serif text-[17px] sm:text-[18px] tracking-tight text-forest leading-none font-bold">
            Sri Gowthami
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                data-testid={`navbar-link-${l.id}`}
                className="nav-link text-[11px] font-bold tracking-wide text-ink/80 hover:text-forest transition-colors uppercase font-sans"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <Link
          href="/auth/sign-in"
          data-testid="navbar-login-button"
          className="bg-forest hover:bg-forest-deep text-paper rounded-full px-6 py-2.5 text-[11px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 uppercase font-sans block text-center"
        >
          Login
        </Link>
      </nav>
    </header>
  );
};

export default BookNavbar;
