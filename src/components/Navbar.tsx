'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function Navbar() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const googleSignInButtonRef = useRef<HTMLDivElement>(null);
  const googleSignInButtonMobileRef = useRef<HTMLDivElement>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      const initializeGoogle = (ref: React.RefObject<HTMLDivElement>) => {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
          callback: async (response: any) => {
            const idToken = response.credential;
            try {
              const res = await fetch(`${API_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
              });
              if (res.ok) {
                const data = await res.json();
                document.cookie = `auth_token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
                if (data.user) {
                  document.cookie = `user_email=${data.user.email}; path=/; max-age=${60 * 60 * 24 * 7}`;
                  document.cookie = `user_name=${encodeURIComponent(data.user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
                  document.cookie = `user_id=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
                }
                setIsSignedIn(true);
                setNavOpen(false);
                router.push('/chat');
              } else {
                const errorData = await res.json();
                alert('Login failed: ' + errorData.message);
              }
            } catch (error) {
              alert('An unexpected error occurred during login.');
            }
          },
        });
        if (ref.current) {
          window.google.accounts.id.renderButton(ref.current, {
            theme: 'outline',
            size: 'large',
          });
        }
      };
      initializeGoogle(googleSignInButtonRef as React.RefObject<HTMLDivElement>);
      initializeGoogle(googleSignInButtonMobileRef as React.RefObject<HTMLDivElement>);
    }
  }, [router]);

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-transparent z-20 relative">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="ManojAI Logo" width={44} height={44} className="rounded-full shadow-lg" />
        <span className="text-2xl font-bold text-white tracking-tight ml-2">ManojAI</span>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
        {!isSignedIn && (
          <div ref={googleSignInButtonRef} style={{ minWidth: 120 }} />
        )}
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center text-gray-300 hover:text-white focus:outline-none text-3xl z-20"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Open navigation menu"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      {/* Mobile dropdown */}
      {navOpen && (
        <div className="absolute right-8 top-20 bg-[#232526] border border-white/10 rounded-2xl shadow-xl flex flex-col items-start gap-4 p-6 z-50 animate-fadeInDown w-56 md:hidden" style={{zIndex: 1000}}>
          <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors w-full" onClick={()=>setNavOpen(false)}>Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors w-full" onClick={()=>setNavOpen(false)}>Terms of Service</Link>
          {!isSignedIn && (
            <div ref={googleSignInButtonMobileRef} style={{ minWidth: 120, width: '100%' }} />
          )}
        </div>
      )}
    </nav>
  );
}
