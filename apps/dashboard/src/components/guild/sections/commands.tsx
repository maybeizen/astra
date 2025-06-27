import GuildSection from "@/components/guild/section";

interface CommandsProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Commands({ guild }: CommandsProps) {
  const commands = [
    { name: "ping", description: "Check bot latency", enabled: true },
    { name: "help", description: "Show available commands", enabled: true },
    { name: "kick", description: "Kick a member", enabled: true },
    { name: "ban", description: "Ban a member", enabled: false },
    { name: "clear", description: "Clear messages", enabled: true },
    { name: "userinfo", description: "Get user information", enabled: true },
  ];

  return (
    <GuildSection
      title="Command Settings"
      description="Enable or disable bot commands for your server."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Available Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commands.map((command) => (
            <div
              key={command.name}
              className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-md"
            >
              <div>
                <h4 className="font-medium text-white">/{command.name}</h4>
                <p className="text-sm text-neutral-400">
                  {command.description}
                </p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={command.enabled}
                  className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm text-neutral-300">Enabled</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </GuildSection>
  );
}
