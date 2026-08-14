"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Leads", href: "/dashboard/leads", icon: UserGroupIcon },
  { name: "Insurance Plans", href: "/dashboard/plans", icon: DocumentTextIcon },
  { name: "Advisors", href: "/dashboard/advisors", icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("securelife_token");
    localStorage.removeItem("securelife_user");
    router.push("/login");
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-gradient-to-br from-blue-50 via-blue-50/90 to-indigo-50/80 backdrop-blur-md shadow-lg lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="px-6 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-2xl font-bold text-blue-700"
          >
            <span>🛡️</span>
            SecureLife
          </Link>
          <p className="mt-0.5 text-xs text-gray-500">Insurance CRM</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-blue-200/60 text-blue-700 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-blue-600"
                      : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      active ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="px-4 pb-6 pt-2">
          <div className="mb-4 rounded-lg bg-white/40 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-200/70 text-blue-700">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">Admin</p>
                <p className="truncate text-xs text-gray-500">admin@securelife.lk</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100/60"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}