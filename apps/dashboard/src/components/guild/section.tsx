import { Button } from "@/components/button";

interface GuildSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  onSave?: () => Promise<void> | void;
  saving?: boolean;
}

export default function GuildSection({
  title,
  description,
  children,
  className,
  onSave,
  saving = false,
}: GuildSectionProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-neutral-400">{description}</p>
          </div>
          {onSave && (
            <Button
              variant="primary"
              size="sm"
              onClick={onSave}
              loading={saving}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
        <div className="h-0.5 w-full bg-neutral-800 rounded-full" />
      </div>
      {children}
    </div>
  );
}
