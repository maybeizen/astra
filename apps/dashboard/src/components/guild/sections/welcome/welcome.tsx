import GuildSection from "@/components/guild/section";
import { WelcomeForm } from "./welcome-form";
import { useWelcomeState } from "./useWelcomeState";
import { Guild } from "./types";

interface WelcomeProps {
  guild: Guild;
}

export function Welcome({ guild }: WelcomeProps) {
  const {
    loading,
    saving,
    welcomeMessage,
    setWelcomeMessage,
    enableWelcome,
    setEnableWelcome,
    sendDm,
    setSendDm,
    dmMessage,
    setDmMessage,
    enableCard,
    setEnableCard,
    cardMessage,
    setCardMessage,
    channelId,
    setChannelId,
    welcomeType,
    setWelcomeType,
    embedTitle,
    setEmbedTitle,
    embedDescription,
    setEmbedDescription,
    embedColor,
    setEmbedColor,
    embedImage,
    setEmbedImage,
    cardImageUrl,
    setCardImageUrl,
    enableEmbed,
    setEnableEmbed,
    saveWelcomeData,
  } = useWelcomeState(guild.id);

  if (loading) {
    return (
      <GuildSection
        title="Welcome Settings"
        description="Configure welcome messages and onboarding for new members."
        className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
      >
        <div className="flex items-center justify-center py-8">
          <i className="fas fa-spinner-third animate-spin text-2xl"></i>
        </div>
      </GuildSection>
    );
  }

  return (
    <GuildSection
      title="Welcome Settings"
      description="Configure welcome messages and onboarding for new members."
      className="flex flex-col gap-4 w-full bg-neutral-900/50 rounded-lg p-4"
      onSave={saveWelcomeData}
      saving={saving}
    >
      <div className="bg-neutral-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Welcome Configuration</h3>
        <p className="text-neutral-400 mb-4">
          Customize how new members are welcomed to {guild.name}. Choose one
          welcome type below.
        </p>

        <WelcomeForm
          channelId={channelId}
          setChannelId={setChannelId}
          welcomeType={welcomeType}
          setWelcomeType={setWelcomeType}
          enableWelcome={enableWelcome}
          setEnableWelcome={setEnableWelcome}
          welcomeMessage={welcomeMessage}
          setWelcomeMessage={setWelcomeMessage}
          sendDm={sendDm}
          setSendDm={setSendDm}
          dmMessage={dmMessage}
          setDmMessage={setDmMessage}
          enableCard={enableCard}
          setEnableCard={setEnableCard}
          cardMessage={cardMessage}
          setCardMessage={setCardMessage}
          cardImageUrl={cardImageUrl}
          setCardImageUrl={setCardImageUrl}
          enableEmbed={enableEmbed}
          setEnableEmbed={setEnableEmbed}
          embedTitle={embedTitle}
          setEmbedTitle={setEmbedTitle}
          embedDescription={embedDescription}
          setEmbedDescription={setEmbedDescription}
          embedColor={embedColor}
          setEmbedColor={setEmbedColor}
          embedImage={embedImage}
          setEmbedImage={setEmbedImage}
        />
      </div>
    </GuildSection>
  );
}
