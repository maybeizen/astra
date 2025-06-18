import GuildSection from "@/components/guild/section";

interface OverviewProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Overview({ guild }: OverviewProps) {
  return (
    <GuildSection
      title="Server Overview"
      description="View and manage your server's settings and information."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Server Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Name:</span>
              <span className="text-white">{guild.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Members:</span>
              <span className="text-white">
                {guild.memberCount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Role:</span>
              <span className="text-white">
                {guild.owner ? "Owner" : "Admin"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Server Features</h3>
          <div className="space-y-2">
            {guild.features.length > 0 ? (
              guild.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <i className="fas fa-check text-green-400 text-sm"></i>
                  <span className="text-white capitalize">
                    {feature.replace(/_/g, " ")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-neutral-400">No special features enabled</p>
            )}
          </div>
        </div>
      </div>
    </GuildSection>
  );
}
