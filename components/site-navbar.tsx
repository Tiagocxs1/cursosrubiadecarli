'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#contato', label: 'Contato' },
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 text-[#1A1A1A]">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-base sm:text-xl font-bold tracking-widest uppercase text-[#1A1A1A] shrink-0">
          Dra. Rúbia De Carli
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-widest uppercase border-b border-[#1A1A1A]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="https://wa.me/5554992350352"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm tracking-widest uppercase px-3 sm:px-4 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            Garantir Vaga
          </Link>
          {/* Hamburger */}
          <button
            className="md:hidden p-1 text-[#1A1A1A]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm tracking-widest uppercase text-[#1A1A1A] border-b border-gray-100 hover:text-[#D4AF37] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
