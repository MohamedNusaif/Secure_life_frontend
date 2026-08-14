"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-yellow-400"
            >
              SecureLife
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Protecting what matters most – for you and your family.
            </p>
            <div className="mt-4 flex gap-4">
              <span className="text-gray-400 hover:text-yellow-400 transition cursor-pointer">
                Facebook
              </span>
              <span className="text-gray-400 hover:text-yellow-400 transition cursor-pointer">
                Twitter
              </span>
              <span className="text-gray-400 hover:text-yellow-400 transition cursor-pointer">
                LinkedIn
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-sm text-gray-400 hover:text-white transition">
                  Insurance Plans
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-sm text-gray-400 hover:text-white transition">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
              Support
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/claims" className="text-sm text-gray-400 hover:text-white transition">
                  File a Claim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>📞 +94 11 234 5678</li>
              <li>✉️ info@securelife.lk</li>
              <li>📍 Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SecureLife Insurance PLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}