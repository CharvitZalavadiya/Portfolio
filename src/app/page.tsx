'use client';

import { useState, useEffect } from 'react';
import HomePage from "@/components/HomePage";
import LoginPage from "@/components/LoginPage";

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
    <>
      {isLoggedIn ? <HomePage /> : <LoginPage animationDirection={animationDirection} />}
    </>
  );
}
