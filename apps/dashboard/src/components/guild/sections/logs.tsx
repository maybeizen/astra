import GuildSection from "@/components/guild/section";

interface LogsProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Logs({ guild }: LogsProps) {
  return (
    <GuildSection
      title="Logging System"
      description="Configure audit logs and activity tracking."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Log Configuration</h3>
        <p className="text-neutral-400 mb-4">
          Set up channels for tracking server activity and moderation actions.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Log Channel
            </label>
            <select className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Select a channel...</option>
              <option>#mod-logs</option>
              <option>#audit-logs</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-neutral-300">
                Log member joins/leaves
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-neutral-300">
                Log moderation actions
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-neutral-300">
                Log message edits/deletions
              </span>
            </label>
          </div>
        </div>
      </div>
    </GuildSection>
  );
}
