import GuildSection from "@/components/guild/section";
import { InputLabel, SelectMenu, Checkbox } from "@/components/input";
import { useState } from "react";
import { useNotification } from "@/hooks";

interface ModerationProps {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    owner: boolean;
    features: string[];
  };
}

export function Moderation({ guild }: ModerationProps) {
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useNotification();

  // Form state
  const [filterContent, setFilterContent] = useState(false);
  const [blockSpam, setBlockSpam] = useState(false);
  const [preventMentions, setPreventMentions] = useState(false);
  const [warnCaps, setWarnCaps] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState("3");
  const [defaultAction, setDefaultAction] = useState("timeout-10");

  const warningOptions = [
    { value: "1", label: "1 warning" },
    { value: "2", label: "2 warnings" },
    { value: "3", label: "3 warnings" },
    { value: "5", label: "5 warnings" },
  ];

  const actionOptions = [
    { value: "timeout-5", label: "Timeout (5 minutes)" },
    { value: "timeout-10", label: "Timeout (10 minutes)" },
    { value: "timeout-60", label: "Timeout (1 hour)" },
    { value: "kick", label: "Kick" },
    { value: "ban", label: "Ban" },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);

      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      success("Moderation settings saved successfully!", { duration: 3000 });
    } catch (err) {
      console.error("Error saving moderation settings:", err);
      showError("Failed to save moderation settings", { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <GuildSection
      title="Moderation Settings"
      description="Configure moderation tools and automated actions."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Auto-Moderation</h3>
          <div className="space-y-3">
            <Checkbox
              id="filter-content"
              label="Filter inappropriate content"
              checked={filterContent}
              onChange={(e) => setFilterContent(e.target.checked)}
            />
            <Checkbox
              id="block-spam"
              label="Block spam messages"
              checked={blockSpam}
              onChange={(e) => setBlockSpam(e.target.checked)}
            />
            <Checkbox
              id="prevent-mentions"
              label="Prevent mass mentions"
              checked={preventMentions}
              onChange={(e) => setPreventMentions(e.target.checked)}
            />
            <Checkbox
              id="warn-caps"
              label="Warn on caps abuse"
              checked={warnCaps}
              onChange={(e) => setWarnCaps(e.target.checked)}
            />
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Action Settings</h3>
          <div className="space-y-3">
            <div>
              <InputLabel htmlFor="warning-threshold">
                Warning Threshold
              </InputLabel>
              <SelectMenu
                id="warning-threshold"
                options={warningOptions}
                placeholder="Select threshold..."
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(e.target.value)}
              />
            </div>
            <div>
              <InputLabel htmlFor="default-action">Default Action</InputLabel>
              <SelectMenu
                id="default-action"
                options={actionOptions}
                placeholder="Select action..."
                value={defaultAction}
                onChange={(e) => setDefaultAction(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </GuildSection>
  );
}
