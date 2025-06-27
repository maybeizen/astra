import GuildSection from "@/components/guild/section";

interface EconomyProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Economy({ guild }: EconomyProps) {
  return (
    <GuildSection
      title="Economy System"
      description="Configure virtual currency and economy features."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Economy Configuration</h3>
        <p className="text-neutral-400 mb-4">
          Set up virtual currency and economic activities.
        </p>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-neutral-300">
              Enable economy system
            </span>
          </label>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Currency Name
            </label>
            <input
              type="text"
              defaultValue="coins"
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Starting Balance
            </label>
            <input
              type="number"
              defaultValue={1000}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </GuildSection>
  );
}
