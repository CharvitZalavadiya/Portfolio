import { Inbox, Star, Send, FileText, PenLine } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const emails = [
  {
    id: 1,
    sender: "Google",
    subject: "Welcome to Gmail!",
    snippet: "Get started with your new inbox.",
    time: "9:00 AM",
    unread: true,
    details: `Hi there!\n\nWelcome to your new Gmail account. Here are a few tips to get started:\n\n- Organize your inbox with labels and filters.\n- Try out the search bar to quickly find emails.\n- Download the Gmail app for your phone.\n\nThanks for choosing Google!\n\nThe Gmail Team`,
  },
  {
    id: 2,
    sender: "GitHub",
    subject: "Repository starred!",
    snippet: "Your repo just got a new star.",
    time: "8:45 AM",
    unread: false,
    details: `Hi Charvit,\n\nCongratulations! Someone just starred your repository.\n\nKeep up the great work and keep building awesome things.\n\nBest,\nGitHub Team`,
  },
  {
    id: 3,
    sender: "LinkedIn",
    subject: "New connection request",
    snippet: "You have a new connection.",
    time: "Yesterday",
    unread: true,
    details: `Hello,\n\nYou have received a new connection request on LinkedIn.\n\nExpand your network to discover more opportunities.\n\nBest regards,\nLinkedIn Team`,
  },
];

const GmailData = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll">
      {/* Top Section: Gmail and Avatar */}
      <div className="flex items-center justify-between px-8 py-2">
        <div className="text-3xl font-bold tracking-tight">Gmail</div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <Image src="/avatar.jpg" alt="User Avatar" width={48} height={48} className="object-cover w-full h-full" />
        </div>
      </div>
      {/* Main Grid Section */}
      <div className="grid grid-cols-5 flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="border-r border-gray-800 flex flex-col py-4 px-2 gap-2 min-w-[120px] h-full">
          <a
            href="https://mail.google.com/mail/u/0/#inbox?compose=new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl px-3 py-2 font-bold mb-4 w-full shadow-lg transition-all text-sm"
          >
            <PenLine size={18} />
            <span className="hidden md:inline">Compose</span>
          </a>
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#232527]/70 font-semibold text-left bg-[#232527] text-red-300 shadow-sm transition-all text-sm">
              <Inbox size={18} />
              <span className="hidden md:inline">Inbox</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#232527]/70 font-semibold text-left text-yellow-300 transition-all text-sm">
              <Star size={18} />
              <span className="hidden md:inline">Starred</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#232527]/70 font-semibold text-left text-blue-300 transition-all text-sm">
              <Send size={18} />
              <span className="hidden md:inline">Sent</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#232527]/70 font-semibold text-left text-green-300 transition-all text-sm">
              <FileText size={18} />
              <span className="hidden md:inline">Drafts</span>
            </button>
          </nav>
        </aside>
        {/* Email List */}
        <main className="col-span-2 flex flex-col min-w-0 px-2 py-4">
          <div className="border-b border-gray-800 pb-2 mb-2 flex items-center gap-2">
            <span className="text-base font-bold text-gray-200">Primary</span>
            <span className="text-xs rounded-full px-2 py-0.5 font-semibold text-gray-400">{emails.length}</span>
          </div>
          <div className="flex-1 flex flex-col gap-3 pr-1">
            {emails.map(email => (
              <div
                key={email.id}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all ${selected === email.id ? 'bg-[#232527]/80' : 'bg-transparent hover:bg-[#232527]/40'}`}
                onClick={() => setSelected(email.id)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-base font-bold text-white shadow">
                  {email.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate text-base">{email.sender}</span>
                    <span className="text-xs text-gray-400 ml-2">{email.time}</span>
                  </div>
                  <div className="truncate text-base font-medium mb-0.5">{email.subject}</div>
                  <div className="truncate text-xs text-gray-400">{email.snippet}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
        {/* Preview Section */}
        <section className="col-span-2 flex flex-col flex-1 items-center justify-start border-l border-[#232527] shadow-xl ml-2 p-8 min-w-[320px]">
          {selected ? (
            <div className="w-full max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow">
                  {emails.find(e => e.id === selected)?.sender[0]}
                </div>
                <div>
                  <div className="font-bold text-base">{emails.find(e => e.id === selected)?.sender}</div>
                  <div className="text-xs text-gray-400">{emails.find(e => e.id === selected)?.time}</div>
                </div>
              </div>
              <div className="font-semibold text-lg mb-1">{emails.find(e => e.id === selected)?.subject}</div>
              <div className="text-gray-300 mb-4">{emails.find(e => e.id === selected)?.snippet}</div>
              <pre className="text-gray-400 text-xs whitespace-pre-line bg-transparent p-0 m-0">{emails.find(e => e.id === selected)?.details}</pre>
            </div>
          ) : (
            <div className="text-gray-600 text-lg">Select an email to read</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GmailData;
