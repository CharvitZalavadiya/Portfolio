import Image from "next/image";

interface AboutDevicePopupProps {
  onClose: () => void;
}


import { useRef } from "react";

const AboutDevicePopup = ({ onClose }: AboutDevicePopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Handler for clicking outside the popup
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] h-screen flex items-center justify-center bg-black/30"
      style={{ pointerEvents: 'auto' }}
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={popupRef}
        className="bg-gray-100/10 backdrop-blur-[2px] rounded-2xl p-1 max-h-[80vh] max-w-[40vw] w-full flex flex-col items-center animate-fade-in"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="w-full rounded-2xl overflow-hidden">
          <Image
            src="/homePage.png"
            alt="About Device"
            width={350}
            height={350}
            className="object-cover w-full"
          />
        </div>
        <div className="text-gray-200/60 gap-2 py-6 px-4 w-full">
          <div className="text-md grid">
            <span className="font-semibold text-gray-200/80">User</span>
            <span>Charvit Zalavadiya</span>
          </div>
          <div className="my-2 h-px w-full bg-gray-300/30" />
          <div className="text-md grid">
            <span className="font-semibold text-gray-200/80">Domain</span>
            <span>FullStack, DevOps, Cloud Computing</span>
          </div>
          <div className="my-2 h-px w-full bg-gray-300/30" />
          <div className="text-md grid">
            <span className="font-semibold text-gray-200/80">Education</span>
            {/* collage */}
            <span>B.Tech - Information and Communication Technology</span>
            <i>
              <span>Pandit Deendayal Energy University</span>
              <span className="flex justify-between">
                <span>
                  CGPA : <strong>9.25</strong>/10
                </span>
                <span>2022-2026</span>
              </span>
            </i>
            {/* 12th */}
            <span className="mt-6">Higher Secondary School</span>
            <i>
              <span>A B Higher Secondary School</span>
              <span className="flex justify-between">
                <span>
                  Percentage : <strong>91%</strong>
                </span>
                <span>2020-2022</span>
              </span>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDevicePopup;
