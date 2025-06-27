'use client';

import { useState, useEffect } from 'react';
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    // Check localStorage on component mount
    const loggedInStatus = localStorage.getItem('loggedin');
    setIsLoggedIn(loggedInStatus === 'true');

    // Listen for login/logout events
    const handleLogin = () => {
      setAnimationDirection('up');
      setIsLoggedIn(true);
    };
    const handleLogout = () => {
      setAnimationDirection('down');
      setIsLoggedIn(false);
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return (
    <div className="relative w-[100dvw] h-[100dvh] overflow-hidden bg-black">
      <Image
        src="/homePage.png"
        alt="Home Background"
        fill
        className="object-cover z-0 opacity-80"
        style={{ pointerEvents: "none", userSelect: "none" }}
        priority
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {isLoggedIn ? <HomePage /> : <LoginPage animationDirection={animationDirection} />}
      </div>
    </div>
  );
}
