import { useState } from "react";

interface NavItem {
  name: string;
  icon: string;
  key: string;
}

interface GuildNavSelectorProps {
  className?: string;
  children?: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function GuildNavSelector({
  className,
  children,
  activeTab,
  onTabChange,
}: GuildNavSelectorProps) {
  const navItems: NavItem[] = [
    {
      name: "Overview",
      icon: "fas fa-objects-column",
      key: "overview",
    },
    {
      name: "Welcome",
      icon: "fas fa-handshake",
      key: "welcome",
    },
    {
      name: "Moderation",
      icon: "fas fa-shield",
      key: "moderation",
    },
    {
      name: "Commands",
      icon: "fas fa-terminal",
      key: "commands",
    },
    {
      name: "Tickets",
      icon: "fas fa-ticket-alt",
      key: "tickets",
    },
    {
      name: "Levels",
      icon: "fas fa-level-up-alt",
      key: "levels",
    },
    {
      name: "Embeds",
      icon: "fas fa-message",
      key: "embeds",
    },
    {
      name: "Economy",
      icon: "fas fa-coins",
      key: "economy",
    },
    {
      name: "Giveaways",
      icon: "fas fa-gift",
      key: "giveaways",
    },
    {
      name: "Logs",
      icon: "fas fa-file-alt",
      key: "logs",
    },
  ] as NavItem[];

  return (
    <div
      className={`bg-neutral-900/50 rounded-lg shadow-lg w-fit p-4 flex flex-col ${className}`}
    >
      <div className="flex flex-col items-start">
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onTabChange(item.key)}
                className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-md transition-all w-38 text-left ${
                  activeTab === item.key
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <i className={`${item.icon} text-xs`}></i>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
