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
    <div className={`${className}`}>
      <div className="p-6 border-b border-neutral-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-cog text-sm text-white"></i>
              </div>
              <h2 className="text-xl font-bold text-neutral-100">{title}</h2>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          {onSave && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={onSave}
                loading={saving}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner-third animate-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
