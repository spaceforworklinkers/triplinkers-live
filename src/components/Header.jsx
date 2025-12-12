"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UniversalLeadModal from "@/components/UniversalLeadModal";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = React.useState(false);

  // OLD scroll functionality still kept (in case needed)
  const handleGetQuote = () => {
    setModalOpen(true); // OPEN MODAL DIRECTLY
  };

  React.useEffect(() => {
    const scrollTo = searchParams.get("scroll");

    if (pathname === "/" && scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("scroll");
      router.replace(`/?${newParams.toString()}`);
    }
  }, [pathname, searchParams, router]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/">
                <Image
                  src="/images/logo/triplinkers-svg.svg"
                  alt="TripLinkers - Stop searching. Start Travelling"
                  width={150}
                  height={60}
                  className="h-12 md:h-16 w-auto"
                />
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-600 font-karla hover:text-teal-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/packages"
                className="text-gray-600 font-karla hover:text-teal-600 font-medium transition-colors"
              >
                Packages
              </Link>
              <Link
                href="/about"
                className="text-gray-600 font-karla hover:text-teal-600 font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 font-karla hover:text-teal-600 font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setModalOpen(true)}
              className="bg-orange-500 font-karla hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Quote 
            </motion.button>
          </div>
        </nav>
      </header>

      {/* UNIVERSAL LEAD MODAL */}
      <UniversalLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => console.log("Lead Submitted")}
      />
    </>
  );
};

export default Header;
