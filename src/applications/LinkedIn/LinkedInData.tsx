import Image from "next/image";
import { ExternalLink } from "lucide-react";

const LinkedInData = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#1a1d1f] rounded-xl shadow-lg overflow-hidden border border-gray-800">
      {/* Banner and Profile */}
      <div className="relative h-40">
        <Image
          src="/linkedin/LinkedInBanner.png"
          alt="LinkedIn Banner"
          fill
          className="object-cover w-full h-full"
          style={{ zIndex: 0 }}
        />
        <div className="absolute left-8 -bottom-16 flex items-center z-10">
          <div className="w-32 h-32 rounded-full border-4 border-[#1a1d1f] bg-gray-400 overflow-hidden">
            <Image
              src="/linkedin/avatar.jpg"
              alt="Charvit Zalavadiya"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      {/* Main Info */}
      <div className="pt-20 px-8 pb-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/charvitzalavadiya/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Charvit Zalavadiya
            </a>
            <span className="text-base font-normal align-middle text-gray-400 ml-1">
              He/Him
            </span>
            <span className="ml-1">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2l4-4" />
              </svg>
            </span>
          </h1>
          <div className="text-gray-300 text-base mt-1 font-medium">
            Versatile Programmer | Scalable System Designer | Software +
            Hardware
          </div>
          <div className="text-gray-400 text-sm mt-1">
            Porbandar, Gujarat, India
          </div>
          <div className="mt-2">
            <a
              href="https://charvitzalavadiya.vercel.app"
              className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio (opens in a new tab)"
            >
              Portfolio
              <ExternalLink size={16} className="inline-block align-middle" />
            </a>
          </div>
          <div className="mt-1">
            <span className="text-sm font-medium">500+ connections</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col gap-2 min-w-[220px] items-end md:items-start">
          {/* Company/Education Badges moved here for right alignment */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/rebel-minds-india/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <div className="bg-transparent rounded w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/linkedin/rebelminds.png"
                    alt="Rebel Minds Alliance"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium">
                  Rebel Minds Alliance
                </span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/school/pdeuofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <div className="bg-transparent rounded w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/linkedin/pdeu.png"
                    alt="PDEU"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium">
                  Pandit Deendayal Energy University
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Company/Education Badges moved to main info section for alignment */}
      {/* Experience Section */}
      <div className="px-8 pt-4 pb-2">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <a
              href="https://www.linkedin.com/company/rebel-minds-india/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent rounded w-12 h-12 flex items-center justify-center hover:underline"
              style={{ textDecoration: "none" }}
            >
              <Image
                src="/linkedin/rebelminds.png"
                alt="Rebel Minds Alliance"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </a>
            <div>
              <div className="font-semibold text-base">
                <a
                  href="https://www.linkedin.com/company/rebel-minds-india/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Full Stack Developer
                </a>
              </div>
              <div className="text-sm text-gray-300">
                Rebel Minds Alliance · Internship
              </div>
              <div className="text-xs text-gray-400">
                May 2025 - Present · 3 mos
              </div>{" "}
              <div className="text-xs text-gray-400">
                {" "}
                Gandhinagar, Gujarat, India · On-site
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-start border-t border-gray-700 pt-4">
            <a
              href="https://www.linkedin.com/company/encode-pdpu/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent rounded w-12 h-12 flex items-center justify-center hover:underline"
              style={{ textDecoration: "none" }}
            >
              <Image
                src="/linkedin/encode.png"
                alt="Encode PDEU"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </a>
            <div>
              <div className="font-semibold text-base">
                <a
                  href="https://www.linkedin.com/company/encode-pdpu/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Web Development Commitee Member
                </a>
              </div>
              <div className="text-sm text-gray-300">
                <a
                  href="https://www.linkedin.com/company/encode-pdpu/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Encode PDEU
                </a>
              </div>
              <div className="text-xs text-gray-400">
                Sep 2023 - Sep 2024 · 1 yr 1 mo{" "}
              </div>{" "}
              <div className="text-xs text-gray-400">
                {" "}
                Gandhinagar, Gujarat, India · On-site
              </div>
              <div className="text-sm not-last:text-gray-300 mt-1">Signing of</div>
            </div>
          </div>
        </div>
      </div>
      {/* Education Section */}
      <div className="px-8 pt-4 pb-2">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <a
              href="https://www.linkedin.com/school/pdeuofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded w-12 h-12 flex items-center justify-center hover:underline"
              style={{ textDecoration: "none" }}
            >
              <Image
                src="/linkedin/pdeu.png"
                alt="PDEU"
                width={32}
                height={32}
                className="w-12 h-12 object-contain"
              />
            </a>
            <div>
              <div className="font-semibold text-base">
                <a
                  href="https://www.linkedin.com/school/pdeuofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Pandit Deendayal Energy University
                </a>
              </div>
              <div className="text-sm text-gray-300">
                Bachelor's degree, Information and Communication Technology
              </div>
              <div className="text-xs text-gray-400">Oct 2022 - Jul 2026</div>
              <div className="text-xs text-gray-400">Grade: 9.25</div>
            </div>
          </div>
          <div className="flex gap-3 items-start border-t border-gray-700 pt-4">
            <div className="bg-white rounded w-12 h-12 flex items-center justify-center">
              <Image
                src="/linkedin/ab.png"
                alt="A B Higer Secondary School"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-base">
                A B Higer Secondary School
              </div>
              <div className="text-sm text-gray-300">HSC</div>
              <div className="text-xs text-gray-400">Grade: 91%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInData;
