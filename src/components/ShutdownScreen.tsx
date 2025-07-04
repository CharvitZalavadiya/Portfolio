'use client';

import { useEffect } from 'react';

interface ShutdownScreenProps {
  onKeyPress: () => void;
}

const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onKeyPress }) => {
  useEffect(() => {
    const handleKeyDown = () => {
      // Trigger boot animation on any key press
      onKeyPress();
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);

  return (
    <div className="fixed inset-0 bg-black w-[100dvw] h-[100dvh] z-50 flex items-center justify-center">
      {/* Completely black screen - no content */}
    </div>
  );
};

export default ShutdownScreen;
