import {
  InputLabel,
  TextArea,
  Checkbox,
  Input,
  SelectMenu,
} from "@/components/input";
import { EmbedEditor } from "./embed-editor";
import { VariablesHelp } from "./variables-help";

interface WelcomeFormProps {
  channelId: string;
  setChannelId: (value: string) => void;
  welcomeType: string;
  setWelcomeType: (value: string) => void;

  welcomeMessage: string;
  setWelcomeMessage: (value: string) => void;

  dmMessage: string;
  setDmMessage: (value: string) => void;

  cardMessage: string;
  setCardMessage: (value: string) => void;
  cardContent: string;
  setCardContent: (value: string) => void;
  cardImageUrl: string;
  setCardImageUrl: (value: string) => void;
  showCount: boolean;
  setShowCount: (value: boolean) => void;

  enableEmbed: boolean;
  setEnableEmbed: (value: boolean) => void;
  embedTitle: string;
  setEmbedTitle: (value: string) => void;
  embedDescription: string;
  setEmbedDescription: (value: string) => void;
  embedColor: string;
  setEmbedColor: (value: string) => void;
  embedImage: string;
  setEmbedImage: (value: string) => void;

  globalEnabled: boolean;
  setGlobalEnabled: (value: boolean) => void;
}

const welcomeTypeOptions = [
  { value: "message", label: "Text Message" },
  { value: "card", label: "Welcome Card" },
  { value: "dm", label: "Direct Message" },
];

export function WelcomeForm({
  channelId,
  setChannelId,
  welcomeType,
  setWelcomeType,
  welcomeMessage,
  setWelcomeMessage,
  dmMessage,
  setDmMessage,
  cardMessage,
  setCardMessage,
  cardContent,
  setCardContent,
  cardImageUrl,
  setCardImageUrl,
  showCount,
  setShowCount,
  enableEmbed,
  setEnableEmbed,
  embedTitle,
  setEmbedTitle,
  embedDescription,
  setEmbedDescription,
  embedColor,
  setEmbedColor,
  embedImage,
  setEmbedImage,
  globalEnabled,
  setGlobalEnabled,
}: WelcomeFormProps) {
  return (
    <div className="space-y-8">
      <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-cog text-blue-400 text-sm"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-100">
              General Settings
            </h3>
            <p className="text-sm text-neutral-400">
              Configure basic welcome settings
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    globalEnabled ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h4 className="font-medium text-neutral-100">
                    Welcome System
                  </h4>
                  <p className="text-sm text-neutral-400">
                    {globalEnabled
                      ? "All welcome messages are enabled"
                      : "All welcome messages are disabled"}
                  </p>
                </div>
              </div>
              <Checkbox
                id="global-enabled"
                label=""
                checked={globalEnabled}
                onChange={(e) => setGlobalEnabled(e.target.checked)}
                className="ml-4"
              />
            </div>
          </div>

          {globalEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputLabel htmlFor="channel-id">Channel ID</InputLabel>
                <Input
                  id="channel-id"
                  placeholder="Enter channel ID (e.g., 123456789012345678)"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  The channel where welcome messages will be sent
                </p>
              </div>
              <div>
                <InputLabel htmlFor="welcome-type">Welcome Type</InputLabel>
                <SelectMenu
                  id="welcome-type"
                  options={welcomeTypeOptions}
                  value={welcomeType}
                  onChange={(e) => setWelcomeType(e.target.value)}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Choose how to welcome new members
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {globalEnabled && welcomeType === "message" && (
        <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-comment text-green-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Server Welcome Message
              </h3>
              <p className="text-sm text-neutral-400">
                Send welcome messages in the server channel
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <InputLabel htmlFor="welcome-message">Welcome Message</InputLabel>
              <TextArea
                id="welcome-message"
                rows={4}
                placeholder="Welcome to the server! We're glad to have you here."
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />
            </div>

            <Checkbox
              id="enable-embed"
              label="Use embed message"
              checked={enableEmbed}
              onChange={(e) => setEnableEmbed(e.target.checked)}
            />

            {enableEmbed && (
              <div className="pl-6 border-l-2 border-neutral-700/50">
                <EmbedEditor
                  title={embedTitle}
                  setTitle={setEmbedTitle}
                  description={embedDescription}
                  setDescription={setEmbedDescription}
                  color={embedColor}
                  setColor={setEmbedColor}
                  image={embedImage}
                  setImage={setEmbedImage}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {globalEnabled && welcomeType === "dm" && (
        <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-envelope text-purple-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Direct Message Welcome
              </h3>
              <p className="text-sm text-neutral-400">
                Send private welcome messages to new members
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <InputLabel htmlFor="dm-message">DM Message</InputLabel>
              <TextArea
                id="dm-message"
                rows={4}
                placeholder="Welcome to our community! We're excited to have you here."
                value={dmMessage}
                onChange={(e) => setDmMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {globalEnabled && welcomeType === "card" && (
        <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-image text-orange-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Welcome Card
              </h3>
              <p className="text-sm text-neutral-400">
                Create beautiful welcome card images
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <InputLabel htmlFor="card-content">
                Message Content (sent with the card)
              </InputLabel>
              <TextArea
                id="card-content"
                rows={3}
                placeholder="Welcome to our server! 🎉"
                value={cardContent}
                onChange={(e) => setCardContent(e.target.value)}
              />
              <p className="text-xs text-neutral-500 mt-1">
                This message will be sent along with the welcome card image
              </p>
            </div>

            <div>
              <InputLabel htmlFor="card-message">Card Image Text</InputLabel>
              <TextArea
                id="card-message"
                rows={3}
                placeholder="Welcome to our server!"
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
              />
              <p className="text-xs text-neutral-500 mt-1">
                This text will be rendered on the welcome card image
              </p>
            </div>

            <div>
              <InputLabel htmlFor="card-image-url">Card Image URL</InputLabel>
              <Input
                id="card-image-url"
                placeholder="https://example.com/welcome-card.png"
                value={cardImageUrl}
                onChange={(e) => setCardImageUrl(e.target.value)}
              />
            </div>

            <div>
              <Checkbox
                id="show-count"
                label="Show member count on welcome card"
                checked={showCount}
                onChange={(e) => setShowCount(e.target.checked)}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Display the total member count on the welcome card image
              </p>
            </div>
          </div>
        </div>
      )}

      {!globalEnabled && (
        <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-pause text-red-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Welcome System Disabled
              </h3>
              <p className="text-sm text-neutral-400">
                Enable the welcome system above to configure settings
              </p>
            </div>
          </div>
          <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-700/30">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
              <p className="text-sm text-neutral-300">
                When disabled, no welcome messages will be sent to new members.
                Enable the system to configure specific welcome types and
                settings.
              </p>
            </div>
          </div>
        </div>
      )}

      <VariablesHelp />
    </div>
  );
}
