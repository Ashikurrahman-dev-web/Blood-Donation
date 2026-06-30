"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Logo from "./Logo";

import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  const pathname = usePathname();
  if(pathname.includes("dashboard")){
    return null;
  }
  return (
<nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/65 backdrop-blur-md py-3.5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Logo />
        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/"
className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-red-500 font-semibold" : "text-slate-300 hover:text-white"}`}
          >
            Home
          </Link>
          <Link
            href="/request"
className={`text-sm font-medium transition-colors ${pathname.startsWith("/donation-requests") ? "text-red-500 font-semibold" : "text-slate-300 hover:text-white"}`}
          >
            Donation Requests
          </Link>
          
          {/* Funding Link only visible after login */}
          {session && (
            <Link
              href="/funding"
className={`text-sm font-medium transition-colors ${pathname.startsWith("/funding") ? "text-red-500 font-semibold" : "text-slate-300 hover:text-white"}`}
            >
              Funding
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">

          {/* Public Users Link */}
          {!session && (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button
className="inline-flex items-center justify-center font-semibold text-xs text-slate-300 hover:text-white h-9 px-4 rounded-xl hover:bg-white/5 transition"
                >
                  Login
                </button>
              </Link>
              <Link
                href="/registration"
className="inline-flex items-center justify-center font-semibold text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition h-9 px-4 rounded-xl"
              >
                SignUp
              </Link>
            </div>
          )}

          {/* Logged In User Actions */}
          {session && session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
              >
                <Image
                  width={36}
                  height={36}
className="w-9 h-9 rounded-full object-cover border border-red-500 shadow-md shadow-pink-500/10"
                  src={session?.user?.image || "/default-avatar.png"}
                  alt="avatar"
                />
              </button>

              {dropdownOpen && (
<div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 cursor-default">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {session.user.role} Account
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5">{session.user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{session.user.email}</p>
                  </div>

                  {/* Dashboard / Profile Link */}
                  <Link
                    href={`/dashboard/${session?.user?.role}`}
                    onClick={() => setDropdownOpen(false)}
className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaUser className="text-slate-400 text-sm shrink-0" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="border-t border-white/5 my-1.5" />

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-red-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}