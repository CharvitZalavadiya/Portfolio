
import React, { useEffect, useState } from "react";
import GithubProfileSidebar from "./GithubProfileSidebar";
import GithubReadmeData from "./GithubReadmeData";

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

export default function GitHub() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/CharvitZalavadiya")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ color: '#9ca3af', fontSize: 18 }}>
        Loading GitHub profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ color: '#ef4444', fontSize: 18, textAlign: 'center', padding: 24 }}>
        Failed to load GitHub profile.<br />
        <span style={{ fontSize: 15, opacity: 0.7 }}>{error}</span>
      </div>
    );
  }

  // Two-column layout: left = sidebar, right = readme placeholder
  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex flex-row w-full min-h-[400px] min-w-[320px] max-w-[99dvw] items-stretch p-2">
        {/* Left: Profile Sidebar */}
        <div className="h-full min-w-[350px] max-w-[370px] flex" style={{ flex: '0 0 350px' }}>
          <GithubProfileSidebar profile={profile} />
        </div>
        {/* Right: README Data */}
        <div className="flex-1 ml-1 rounded-2xl flex items-center justify-center min-h-[400px] h-full overflow-y-scroll">
          <GithubReadmeData />
        </div>
      </div>
    </div>
  );
}
