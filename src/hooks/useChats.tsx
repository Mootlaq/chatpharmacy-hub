import { useState, useEffect, useRef, useCallback } from "react";
import { Chat } from "@/types/chat";
import { toast } from "sonner";
import { API_URL, processTelegramUpdates } from "@/utils/telegram";

export function useChats(onUpdates?: (updates: any[]) => void) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [deletedChatIds, setDeletedChatIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('deletedChatIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [lastUpdateId, setLastUpdateId] = useState<number>(0);
  const isPolling = useRef(false);

  useEffect(() => {
    localStorage.setItem('deletedChatIds', JSON.stringify([...deletedChatIds]));
  }, [deletedChatIds]);

  const getUpdates = useCallback(async () => {
    if (isPolling.current) {
      console.log("Skipping update - previous request still in progress");
      return;
    }

    try {
      isPolling.current = true;
      const response = await fetch(
        `${API_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=10`
      );
      const data = await response.json();
      
      if (data.ok && data.result && data.result.length > 0) {
        console.log("Received updates:", data.result);
        
        const maxUpdateId = Math.max(...data.result.map((u: any) => u.update_id));
        setLastUpdateId(maxUpdateId);

        if (onUpdates) {
          console.log("Passing updates to message handler");
          onUpdates(data.result);
        } else {
          console.log("No update handler available");
        }
        
        const processedChats = processTelegramUpdates(data.result);
        const filteredChats = processedChats.filter(chat => !deletedChatIds.has(chat.id));
        setChats(filteredChats);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      isPolling.current = false;
    }
  }, [lastUpdateId, deletedChatIds, onUpdates]);

  useEffect(() => {
    getUpdates();

    const pollInterval = setInterval(() => {
      getUpdates();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      isPolling.current = false;
    };
  }, [getUpdates]);

  const handleDeleteChat = (chatId: number) => {
    setDeletedChatIds(prev => new Set([...prev, chatId]));
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    toast.success("Chat deleted successfully");
  };

  return {
    chats,
    getUpdates,
    handleDeleteChat
  };
}