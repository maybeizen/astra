import GuildSection from "@/components/guild/section";

interface TicketsProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Tickets({ guild }: TicketsProps) {
  return (
    <GuildSection
      title="Ticket System"
      description="Configure support ticket channels and settings."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Ticket Configuration</h3>
        <p className="text-neutral-400 mb-4">
          Set up automated ticket creation for support requests.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Ticket Category
            </label>
            <select className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Select a category...</option>
              <option>Support</option>
              <option>General</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-neutral-600 bg-neutral-700 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-neutral-300">
              Enable ticket system
            </span>
          </label>
        </div>
      </div>
    </GuildSection>
  );
}
