'use client';

import { useState, useEffect } from 'react';
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import BootAnimation from "@/components/BootAnimation";
import ShutdownScreen from "@/components/ShutdownScreen";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [showBootAnimation, setShowBootAnimation] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showShutdownScreen, setShowShutdownScreen] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowBootAnimation(true);
      localStorage.setItem('hasVisited', 'true');
    } else {
      // Check localStorage on component mount for returning visitors
      const loggedInStatus = localStorage.getItem('loggedin');
      setIsLoggedIn(loggedInStatus === 'true');
    }

    // Listen for login/logout events
    const handleLogin = () => {
      setAnimationDirection('up');
      setIsLoggedIn(true);
    };
    const handleLogout = () => {
      setAnimationDirection('down');
      setIsLoggedIn(false);
    };

    // Listen for boot animation trigger (restart button)
    const handleBootAnimation = () => {
      setShowBootAnimation(true);
      setShowShutdownScreen(false);
      setIsLoggedIn(false);
      localStorage.setItem('loggedin', 'false');
    };

    // Listen for shutdown trigger
    const handleShutdown = () => {
      setShowShutdownScreen(true);
      setIsLoggedIn(false);
      localStorage.setItem('loggedin', 'false');
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);
    window.addEventListener('triggerBootAnimation', handleBootAnimation);
    window.addEventListener('triggerShutdown', handleShutdown);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('triggerBootAnimation', handleBootAnimation);
      window.removeEventListener('triggerShutdown', handleShutdown);
    };
  }, []);

  const handleBootComplete = () => {
    setShowBootAnimation(false);
    if (isFirstVisit) {
      setIsFirstVisit(false);
      // For first visit, show login page after boot animation
      setIsLoggedIn(false);
    } else {
      // For restart, show login page
      setIsLoggedIn(false);
    }
  };

  const handleShutdownKeyPress = () => {
    // When any key is pressed during shutdown, trigger boot animation
    setShowShutdownScreen(false);
    setShowBootAnimation(true);
  };

  // Show shutdown screen
  if (showShutdownScreen) {
    return <ShutdownScreen onKeyPress={handleShutdownKeyPress} />;
  }

  // Show boot animation
  if (showBootAnimation) {
    return <BootAnimation onComplete={handleBootComplete} />;
  }

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
