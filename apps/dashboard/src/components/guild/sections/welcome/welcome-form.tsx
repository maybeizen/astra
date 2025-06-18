import {
  InputLabel,
  TextArea,
  Checkbox,
  Input,
  SelectMenu,
} from "@/components/ui";
import { EmbedEditor } from "./embed-editor";

interface WelcomeFormProps {
  channelId: string;
  setChannelId: (value: string) => void;
  welcomeType: string;
  setWelcomeType: (value: string) => void;

  enableWelcome: boolean;
  setEnableWelcome: (value: boolean) => void;
  welcomeMessage: string;
  setWelcomeMessage: (value: string) => void;

  sendDm: boolean;
  setSendDm: (value: boolean) => void;
  dmMessage: string;
  setDmMessage: (value: string) => void;

  enableCard: boolean;
  setEnableCard: (value: boolean) => void;
  cardMessage: string;
  setCardMessage: (value: string) => void;
  cardImageUrl: string;
  setCardImageUrl: (value: string) => void;

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
  enableWelcome,
  setEnableWelcome,
  welcomeMessage,
  setWelcomeMessage,
  sendDm,
  setSendDm,
  dmMessage,
  setDmMessage,
  enableCard,
  setEnableCard,
  cardMessage,
  setCardMessage,
  cardImageUrl,
  setCardImageUrl,
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
}: WelcomeFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-medium text-neutral-200">
          General Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="channel-id">Channel ID</InputLabel>
            <Input
              id="channel-id"
              placeholder="Enter channel ID (e.g., 123456789012345678)"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
          </div>
          <div>
            <InputLabel htmlFor="welcome-type">Welcome Type</InputLabel>
            <SelectMenu
              id="welcome-type"
              options={welcomeTypeOptions}
              value={welcomeType}
              onChange={(e) => setWelcomeType(e.target.value)}
            />
          </div>
        </div>
      </div>

      {welcomeType === "message" && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-neutral-200">
            Server Welcome Message
          </h4>
          <div className="space-y-3">
            <Checkbox
              id="enable-welcome"
              label="Enable welcome messages in server"
              checked={enableWelcome}
              onChange={(e) => setEnableWelcome(e.target.checked)}
            />
            {enableWelcome && (
              <div className="space-y-3">
                <div>
                  <InputLabel htmlFor="welcome-message">
                    Welcome Message
                  </InputLabel>
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
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {welcomeType === "dm" && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-neutral-200">
            Direct Message Welcome
          </h4>
          <div className="space-y-3">
            <Checkbox
              id="send-dm"
              label="Send welcome DM to new members"
              checked={sendDm}
              onChange={(e) => setSendDm(e.target.checked)}
            />
            {sendDm && (
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
            )}
          </div>
        </div>
      )}

      {welcomeType === "card" && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-neutral-200">Welcome Card</h4>
          <div className="space-y-3">
            <Checkbox
              id="enable-card"
              label="Enable welcome card (image with welcome message)"
              checked={enableCard}
              onChange={(e) => setEnableCard(e.target.checked)}
            />
            {enableCard && (
              <div className="space-y-3">
                <div>
                  <InputLabel htmlFor="card-message">Card Message</InputLabel>
                  <TextArea
                    id="card-message"
                    rows={3}
                    placeholder="Welcome to our server!"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="card-image-url">
                    Card Image URL
                  </InputLabel>
                  <Input
                    id="card-image-url"
                    placeholder="https://example.com/welcome-card.png"
                    value={cardImageUrl}
                    onChange={(e) => setCardImageUrl(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
