import Image from "next/image";

interface AboutDevicePopupProps {
  onClose: () => void;
}

const AboutDevicePopup = ({ onClose }: AboutDevicePopupProps) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30">
    <div className="bg-gray-100/10 backdrop-blur-2xl rounded-2xl p-1 max-h-[80dvh] max-w-[40dvw] w-fit flex flex-col items-center animate-fade-in">
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
      <button
        className="my-2 px-5 py-1 rounded-lg bg-gray-100/10 hover:cursor-pointer hover:bg-gray-200/20 font-medium border border-gray-200/10 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default AboutDevicePopup;
