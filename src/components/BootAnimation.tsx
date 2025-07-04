import { useEffect, useState } from "react";
import Image from "next/image";

interface BootAnimationProps {
  onComplete: () => void;
}

const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start the loading animation
    const duration = 3000; // 3 seconds
    const intervalTime = 16; // ~60fps
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / totalSteps) * 100;
      
      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        // Animation complete, call onComplete after a brief delay
        setTimeout(onComplete, 200);
      } else {
        setProgress(newProgress);
      }
    }, intervalTime);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center z-[99999]">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Loading Bar */}
      <div className="relative">
        {/* Outer container with light gray border */}
        <div className="w-48 h-2 border border-gray-400 rounded-full bg-transparent">
          {/* Inner progress bar */}
          <div
            className="h-full bg-white rounded-full transition-none"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BootAnimation;
