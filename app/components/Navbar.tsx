"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plans", label: "Insurance Plans" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-700 transition hover:text-blue-800"
          >
            SecureLife
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-medium transition hover:text-blue-700 ${
                  isActive(href)
                    ? "text-blue-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-700"
                    : "text-gray-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-400"
            >
              Get Free Quote
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 transition hover:text-blue-700"
            >
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition hover:text-blue-700 ${
                    isActive(href) ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Free Quote
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-600 transition hover:text-blue-700"
              >
                Staff Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}