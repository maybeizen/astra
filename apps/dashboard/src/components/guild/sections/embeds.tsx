import GuildSection from "@/components/guild/section";

interface EmbedsProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Embeds({ guild }: EmbedsProps) {
  return (
    <GuildSection
      title="Embed Builder"
      description="Create and manage custom embed messages."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Embed Configuration</h3>
        <p className="text-neutral-400 mb-4">
          Design custom embed messages for announcements and events.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Embed Title
            </label>
            <input
              type="text"
              placeholder="Enter embed title..."
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Embed Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter embed description..."
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </GuildSection>
  );
}
