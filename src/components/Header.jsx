"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UniversalLeadModal from "@/components/UniversalLeadModal";
import { Menu, X, ChevronRight, Home, MapPin, Package, BookOpen, Phone, Info } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle scroll params
  useEffect(() => {
    const scrollTo = searchParams.get("scroll");
    if (pathname === "/" && scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("scroll");
      router.replace(`/?${newParams.toString()}`);
    }
  }, [pathname, searchParams, router]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Packages", href: "/packages", icon: Package },
    { name: "Destinations", href: "/destinations", icon: MapPin },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Blogs", href: "/blogs", icon: BookOpen },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <nav className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-[60]">
            <Image
              src="/images/logo/triplinkers-svg.svg"
              alt="TripLinkers"
              width={160}
              height={48}
              className="h-15 md:h-18 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  pathname === link.href
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
             <button
              onClick={() => setModalOpen(true)}
              className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform transition-all active:scale-95 duration-200"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative z-[60]"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
             <span className="font-bold text-lg text-gray-900">Menu</span>
             <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
             >
                <X className="w-6 h-6" />
             </button>
        </div>

        <div className="flex flex-col h-full overflow-y-auto">
            {/* Links */}
            <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                         pathname === link.href ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <link.icon className="w-5 h-5 opacity-70" />
                        <span className="font-semibold text-lg">{link.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                </Link>
                ))}
            </div>

            <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50">
                <button
                    onClick={() => {
                        setMobileMenuOpen(false);
                        setModalOpen(true);
                    }}
                    className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Get Free Quote
                </button>
                 <p className="text-center text-xs text-gray-400 mt-4">
                    Need help? Call <a href="tel:+919286468530" className="underline font-semibold">+91 92864 68530</a>
                </p>
            </div>
        </div>
      </div>

      {/* Universal Lead Modal */}
      <UniversalLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => console.log("Lead Submitted")}
      />
    </>
  );
};

export default Header;
