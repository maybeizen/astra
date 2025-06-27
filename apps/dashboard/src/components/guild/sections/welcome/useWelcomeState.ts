import { useState, useEffect } from "react";
import { env } from "@/utils/env";
import { useNotification } from "@/hooks";
import { WelcomeData } from "./types";

export function useWelcomeState(guildId: string) {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useNotification();

  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [cardContent, setCardContent] = useState("");
  const [channelId, setChannelId] = useState("");
  const [welcomeType, setWelcomeType] = useState("message");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedDescription, setEmbedDescription] = useState("");
  const [embedColor, setEmbedColor] = useState("#5865F2");
  const [embedImage, setEmbedImage] = useState("");
  const [cardImageUrl, setCardImageUrl] = useState("");
  const [showCount, setShowCount] = useState(false);
  const [enableEmbed, setEnableEmbed] = useState(false);
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const fetchWelcomeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API_URL}/welcomes/guild/${guildId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.welcomes && data.welcomes.length > 0) {
          const welcome = data.welcomes[0];
          setWelcomeData(welcome);

          setWelcomeMessage(welcome.message?.content || "");
          setDmMessage(welcome.dm?.content || "");
          setCardMessage(welcome.card?.cardMessage || "");
          setCardContent(welcome.card?.content || "");
          setChannelId(welcome.channelId || "");
          setWelcomeType(welcome.type || "message");
          setCardImageUrl(welcome.card?.imageUrl || "");
          setShowCount(welcome.card?.showCount || false);

          const hasAnyEnabled =
            welcome.message?.enabled ||
            welcome.dm?.enabled ||
            welcome.card?.enabled;
          setGlobalEnabled(hasAnyEnabled !== false);

          if (welcome.message?.embed) {
            setEnableEmbed(true);
            setEmbedTitle(welcome.message.embed.title || "");
            setEmbedDescription(welcome.message.embed.description || "");
            setEmbedColor(welcome.message.embed.color || "#5865F2");
            setEmbedImage(welcome.message.embed.image || "");
          }
        } else {
          setWelcomeData({
            guildId: guildId,
            channelId: "",
            type: "message",
            message: { enabled: false, content: null, embed: null },
            dm: { enabled: false, content: null, embed: null },
            card: {
              enabled: false,
              content: null,
              embed: null,
              imageUrl: null,
              showCount: false,
              cardMessage: null,
            },
          });
          setGlobalEnabled(true);
        }
      } else {
        console.error("Failed to fetch welcome data");
      }
    } catch (err) {
      console.error("Error fetching welcome data:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateWelcomeSettings = () => {
    if (!globalEnabled) {
      return true;
    }

    if (!channelId.trim()) {
      showError("Channel ID is required", { duration: 5000 });
      return false;
    }

    switch (welcomeType) {
      case "message":
        if (!welcomeMessage.trim()) {
          showError("Welcome message is required for text messages", {
            duration: 5000,
          });
          return false;
        }
        break;
      case "dm":
        if (!dmMessage.trim()) {
          showError("DM message is required for direct messages", {
            duration: 5000,
          });
          return false;
        }
        break;
      case "card":
        if (!cardContent.trim() && !cardMessage.trim()) {
          showError(
            "Either card content or card image text is required for welcome cards",
            { duration: 5000 }
          );
          return false;
        }
        if (!cardImageUrl.trim()) {
          showError("Card image URL is required for welcome cards", {
            duration: 5000,
          });
          return false;
        }
        break;
    }

    return true;
  };

  const saveWelcomeData = async () => {
    if (!validateWelcomeSettings()) {
      return;
    }

    try {
      setSaving(true);

      const embedData = enableEmbed
        ? {
            title: embedTitle || null,
            description: embedDescription || null,
            color: embedColor || null,
            image: embedImage || null,
          }
        : null;

      const isMessageEnabled = globalEnabled && welcomeType === "message";
      const isDmEnabled = globalEnabled && welcomeType === "dm";
      const isCardEnabled = globalEnabled && welcomeType === "card";

      const payload = {
        guildId: guildId,
        channelId: channelId || "general",
        type: welcomeType as any,
        message: {
          enabled: isMessageEnabled,
          content: isMessageEnabled ? welcomeMessage || null : null,
          embed: isMessageEnabled ? embedData : null,
        },
        dm: {
          enabled: isDmEnabled,
          content: isDmEnabled ? dmMessage || null : null,
          embed: null,
        },
        card: {
          enabled: isCardEnabled,
          content: isCardEnabled ? cardContent || null : null,
          embed: null,
          imageUrl: isCardEnabled ? cardImageUrl || null : null,
          showCount: isCardEnabled ? showCount : false,
          cardMessage: isCardEnabled ? cardMessage || null : null,
        },
      };

      const existingId = welcomeData?._id || welcomeData?.id;

      const url = existingId
        ? `${env.API_URL}/welcomes/${existingId}`
        : `${env.API_URL}/welcomes`;

      const method = existingId ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`, {
        existingId,
        payload,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setWelcomeData(updatedData);
        success("Welcome settings saved successfully!", { duration: 3000 });
        await fetchWelcomeData();
      } else {
        const errorData = await response.json();
        console.error("Save failed:", errorData);
        showError(
          `Failed to save: ${
            errorData.error || errorData.message || "Unknown error"
          }`,
          { duration: 5000 }
        );
      }
    } catch (err) {
      console.error("Error saving welcome data:", err);
      showError("Failed to save welcome settings", { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchWelcomeData();
  }, [guildId]);

  return {
    welcomeData,
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
    fetchWelcomeData,
  };
}
