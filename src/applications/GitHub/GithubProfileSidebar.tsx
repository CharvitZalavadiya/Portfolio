import React from "react";
import Image from "next/image";
import {
  Users,
  Building2,
  MapPin,
  Link,
  Linkedin,
  X as XIcon,
  Star,
} from "lucide-react";

type GitHubProfile = {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  location?: string;
  blog?: string;
  company?: string;
};

interface GithubProfileSidebarProps {
  profile: GitHubProfile;
}

const GithubProfileSidebar: React.FC<GithubProfileSidebarProps> = ({
  profile,
}) => {
  return (
    <div className="bg-transparent rounded-2xl w-[350px] max-w-[95vw] min-w-[260px]  flex flex-col items-center mx-auto h-full overflow-y-scroll">
      {/* Avatar */}
      <div className="w-full flex flex-col items-center mt-6">
        <div className="w-[220px] h-[220px] rounded-full overflow-hidden border-4 border-[#21262d] mb-3 bg-[#222] flex items-center justify-center">
          <Image
            src={profile.avatar_url || "/default-avatar.png"}
            alt="Avatar"
            width={220}
            height={220}
            className="w-full h-full object-cover"
            priority
            unoptimized
          />
        </div>
      </div>
      {/* Name and username */}
      <div className="w-full text-left px-7">
        <div className="font-bold text-2xl  mt-2">{profile.name}</div>
        <div className="text-lg text-gray-400 mb-1">
          {profile.login} <span className="text-base ">· he/him</span>
        </div>
      </div>
      {/* Bio */}
      {profile.bio && (
        <div className="w-full text-left px-7 mt-3 text-base">
          {profile.bio}
        </div>
      )}
      {/* Vertical gap between bio and followers/following */}
      <div className="h-4" />
      {/* Followers/Following with group icon */}
      {/* Show Profile button */}
      <div className="w-full px-7 my-3 flex justify-center">
        <a
          href="https://github.com/CharvitZalavadiya"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-500/30 hover:bg-gray-500/35 font-semibold py-2 px-4 rounded-md transition-colors text-sm border border-gray-500 w-full text-center"
        >
          Show Profile
        </a>
      </div>

      <div className="w-full px-7 mb-4 text-gray-400 text-sm flex items-center gap-1">
        <Users size={18} className="mr-1 min-w-[18px]" />
        <span className="mr-3">
          <b className="text-gray-200">{profile.followers}</b> followers
        </span>
        <span className="mr-3">
          <b className="text-gray-200">{profile.following}</b> following
        </span>
      </div>
      {/* Info list */}
      <div className="w-full px-7  text-sm mb-4 flex flex-col gap-3">
        {profile.company && (
          <div className="flex items-center gap-2">
            <Building2 size={18} className="min-w-[18px]" />
            {profile.company}
          </div>
        )}
        {profile.location && (
          <div className="flex items-center gap-2">
            <MapPin size={18} className="min-w-[18px]" />
            {profile.location}
          </div>
        )}
        {profile.blog && profile.blog !== "" && (
          <div className="flex items-center gap-2">
            <Link size={18} className="min-w-[18px]" />
            <a
              href={
                profile.blog.startsWith("http")
                  ? profile.blog
                  : `https://${profile.blog}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-blue-400 hover:underline transition-colors"
            >
              {profile.blog.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
      {/* Social links */}
      <div className="w-full px-7  text-sm mb-4 flex flex-col gap-3">
        {/* LinkedIn */}
        <div className="flex items-center gap-2">
          <Linkedin size={18} className="min-w-[18px]" />
          <a
            href="https://www.linkedin.com/in/CharvitZalavadiya"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-blue-400 hover:underline transition-colors"
          >
            in/CharvitZalavadiya
          </a>
        </div>
        {/* X (Twitter) */}
        <div className="flex items-center gap-2">
          <XIcon size={18} className="min-w-[18px]" />
          <a
            href="https://twitter.com/Charvit_Z"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-blue-400 hover:underline transition-colors"
          >
            @Charvit_Z
          </a>
        </div>
      </div>
      {/* Separator */}
      <div className="w-full border-t border-[#30363d] my-4" />
      {/* Achievements (static icons) */}
      <div className="w-full px-7">
        <div className="font-semibold text-base mb-2">Achievements</div>
        <div className="flex gap-2 items-center mb-2">
          <Image
            src="https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png"
            alt="Yolo"
            width={72}
            height={72}
            className="w-[72px] h-[72px] rounded-lg"
            unoptimized
          />
          <Image
            src="https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png"
            alt="Pull Shark"
            width={72}
            height={72}
            className="w-[72px] h-[72px] rounded-lg"
            unoptimized
          />
          <span className="text-sm bg-orange-200 text-gray-800 font-medium px-2.5 rounded-full pb-0.5 relative -left-10 top-6">x2</span>
        </div>
      </div>
      {/* Separator */}
      <div className="w-full border-t border-[#30363d] my-4" />
      {/* Highlights (static) */}
      <div className="w-full px-7 my-2 mb-5">
        <div className="font-semibold text-base mb-2">Highlights</div>
        <div className="flex items-center gap-2">
          <Star size={16} className="text-gray-400" />
          <span className="rounded-full text-xs px-2 py-0.5 inline-block border border-purple-600 text-purple-500">
            PRO
          </span>
        </div>
      </div>
    </div>
  );
};

export default GithubProfileSidebar;
