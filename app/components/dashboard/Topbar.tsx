"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface User {
  name?: string;
  email?: string;
  role?: string;
}

interface TopbarProps {
  onSidebarToggle?: () => void;
}

export default function Topbar({ onSidebarToggle }: TopbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("securelife_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function logout() {
    localStorage.removeItem("securelife_token");
    localStorage.removeItem("securelife_user");
    router.push("/login");
  }

  const initials = (user?.name || "S")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-br from-blue-50/90 via-blue-50/80 to-indigo-50/80 shadow-md backdrop-blur-md"
          : "bg-gradient-to-br from-blue-50/80 via-blue-50/70 to-indigo-50/70 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side – sidebar toggle + greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSidebarToggle}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-white/40 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="hidden sm:block">
            <p className="text-xs text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">{user?.name || "Staff Member"}</p>
          </div>
        </div>

        {/* Right side – notifications + user dropdown */}
        <div className="flex items-center gap-2">
          {/* Notification bell – no badge */}
          <button
            className="rounded-lg p-2 text-gray-600 transition hover:bg-white/40 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          {/* User dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-expanded={dropdownOpen}
              aria-label="User menu"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-200/70 font-semibold text-blue-700">
                {initials}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
              </div>
              <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                {user?.name || "Staff"}
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Staff Member"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || "staff@securelife.lk"}</p>
                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {user?.role || "Staff"}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-blue-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-blue-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu – slides down with gradient background */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-700/30 bg-gradient-to-br from-blue-900/90 via-blue-950/85 to-indigo-950/80 px-4 py-4 backdrop-blur-md shadow-xl



">
          <div className="flex flex-col space-y-1">
            <MobileLink href="/dashboard" label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="/dashboard/leads" label="Leads" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="/dashboard/plans" label="Insurance Plans" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="/dashboard/advisors" label="Advisors" onClick={() => setMobileMenuOpen(false)} />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50/70"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-white/50"
    >
      {label}
    </Link>
  );
}