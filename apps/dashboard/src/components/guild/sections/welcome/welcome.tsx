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
    dmMessage,
    setDmMessage,
    cardMessage,
    setCardMessage,
    cardContent,
    setCardContent,
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
    showCount,
    setShowCount,
    enableEmbed,
    setEnableEmbed,
    globalEnabled,
    setGlobalEnabled,
    saveWelcomeData,
  } = useWelcomeState(guild.id);

  if (loading) {
    return (
      <GuildSection
        title="Welcome Settings"
        description="Configure welcome messages and onboarding for new members."
        className="w-full"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading welcome settings...</p>
          </div>
        </div>
      </GuildSection>
    );
  }

  return (
    <GuildSection
      title="Welcome Settings"
      description="Configure welcome messages and onboarding for new members."
      className="w-full"
      onSave={saveWelcomeData}
      saving={saving}
    >
      <WelcomeForm
        channelId={channelId}
        setChannelId={setChannelId}
        welcomeType={welcomeType}
        setWelcomeType={setWelcomeType}
        welcomeMessage={welcomeMessage}
        setWelcomeMessage={setWelcomeMessage}
        dmMessage={dmMessage}
        setDmMessage={setDmMessage}
        cardMessage={cardMessage}
        setCardMessage={setCardMessage}
        cardContent={cardContent}
        setCardContent={setCardContent}
        cardImageUrl={cardImageUrl}
        setCardImageUrl={setCardImageUrl}
        showCount={showCount}
        setShowCount={setShowCount}
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
        globalEnabled={globalEnabled}
        setGlobalEnabled={setGlobalEnabled}
      />
    </GuildSection>
  );
}
