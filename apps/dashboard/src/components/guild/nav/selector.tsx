interface NavItem {
  name: string;
  icon: string;
  key: string;
  description: string;
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
      icon: "fas fa-chart-line",
      key: "overview",
      description: "Server statistics and quick actions",
    },
    {
      name: "Welcome",
      icon: "fas fa-handshake",
      key: "welcome",
      description: "Configure welcome messages and cards",
    },
    {
      name: "Moderation",
      icon: "fas fa-shield-alt",
      key: "moderation",
      description: "Auto-moderation and moderation tools",
    },
    {
      name: "Commands",
      icon: "fas fa-terminal",
      key: "commands",
      description: "Custom commands and slash commands",
    },
    {
      name: "Tickets",
      icon: "fas fa-ticket-alt",
      key: "tickets",
      description: "Support ticket system configuration",
    },
    {
      name: "Levels",
      icon: "fas fa-level-up-alt",
      key: "levels",
      description: "XP system and leveling configuration",
    },
    {
      name: "Embeds",
      icon: "fas fa-message",
      key: "embeds",
      description: "Custom embed builder and templates",
    },
    {
      name: "Economy",
      icon: "fas fa-coins",
      key: "economy",
      description: "Virtual currency and shop system",
    },
    {
      name: "Giveaways",
      icon: "fas fa-gift",
      key: "giveaways",
      description: "Giveaway creation and management",
    },
    {
      name: "Logs",
      icon: "fas fa-file-alt",
      key: "logs",
      description: "Audit logs and activity tracking",
    },
  ] as NavItem[];

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-100 mb-2">
          Settings
        </h3>
        <p className="text-sm text-neutral-400">
          Configure your server&apos;s features and behavior
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange(item.key)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 shadow-lg"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"></div>
              )}

              <div
                className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isActive ? "opacity-100" : ""
                }`}
              ></div>

              <div className="relative flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-neutral-800/50 text-neutral-400 group-hover:bg-neutral-700/50 group-hover:text-neutral-200"
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{item.name}</div>
                  <div
                    className={`text-xs transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-300/70"
                        : "text-neutral-500 group-hover:text-neutral-400"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-neutral-500 group-hover:text-neutral-400"
                  }`}
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {children && (
        <div className="mt-8 pt-6 border-t border-neutral-800/50">
          {children}
        </div>
      )}
    </div>
  );
}
