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
  const [enableWelcome, setEnableWelcome] = useState(false);
  const [sendDm, setSendDm] = useState(false);
  const [dmMessage, setDmMessage] = useState("");
  const [enableCard, setEnableCard] = useState(false);
  const [cardMessage, setCardMessage] = useState("");
  const [channelId, setChannelId] = useState("");
  const [welcomeType, setWelcomeType] = useState("message");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedDescription, setEmbedDescription] = useState("");
  const [embedColor, setEmbedColor] = useState("#5865F2");
  const [embedImage, setEmbedImage] = useState("");
  const [cardImageUrl, setCardImageUrl] = useState("");
  const [enableEmbed, setEnableEmbed] = useState(false);

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
          setEnableWelcome(welcome.message?.enabled || false);
          setSendDm(welcome.dm?.enabled || false);
          setDmMessage(welcome.dm?.content || "");
          setEnableCard(welcome.card?.enabled || false);
          setCardMessage(welcome.card?.content || "");
          setChannelId(welcome.channelId || "");
          setWelcomeType(welcome.type || "message");
          setCardImageUrl(welcome.card?.imageUrl || "");

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
            },
          });
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

  const saveWelcomeData = async () => {
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

      const isMessageEnabled = welcomeType === "message" && enableWelcome;
      const isDmEnabled = welcomeType === "dm" && sendDm;
      const isCardEnabled = welcomeType === "card" && enableCard;

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
          content: isCardEnabled ? cardMessage || null : null,
          embed: null,
          imageUrl: isCardEnabled ? cardImageUrl || null : null,
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
    if (welcomeType === "message") {
      setEnableWelcome(true);
      setSendDm(false);
      setEnableCard(false);
    } else if (welcomeType === "dm") {
      setEnableWelcome(false);
      setSendDm(true);
      setEnableCard(false);
    } else if (welcomeType === "card") {
      setEnableWelcome(false);
      setSendDm(false);
      setEnableCard(true);
    }
  }, [welcomeType]);

  useEffect(() => {
    fetchWelcomeData();
  }, [guildId]);

  return {
    welcomeData,
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
    fetchWelcomeData,
  };
}
